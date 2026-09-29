// Fonction Netlify (serverless) qui crée une session de paiement Stripe.
// La vraie clé Stripe doit être ajoutée dans Netlify (Site settings >
// Environment variables), jamais dans le code : STRIPE_SECRET_KEY.

const Stripe = require('stripe');

// Catalogue des 2 programmes. Prix en centimes (EUR).
// -> Modifie les prix ici si besoin, jamais ailleurs.
const CATALOG = {
  '12-16': {
    name: 'Programme Performance — 12-16 ans',
    description: '8 semaines, 4 séances/semaine (salle + terrain), utilisable toute la saison.',
    amount: 3900,
    programme: '12-16',
  },
  'adultes': {
    name: 'Programme Performance — Adultes 17+',
    description: '8 semaines, 4 séances/semaine (salle + terrain), utilisable toute la saison.',
    amount: 4900,
    programme: 'adultes',
  },
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Méthode non autorisée.' }) };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "STRIPE_SECRET_KEY absente des variables d'environnement Netlify." }),
    };
  }

  let productId;
  try {
    ({ productId } = JSON.parse(event.body || '{}'));
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Requête invalide.' }) };
  }

  const product = CATALOG[productId];
  if (!product) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Programme inconnu.' }) };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const siteUrl = process.env.URL || `https://${event.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: product.amount,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/merci.html?programme=${product.programme}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/programmes.html`,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
