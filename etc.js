// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const { successResponse } = require("../../helper/sendResponse");
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });
const createOrder = async (req, res, next) => {
  try {
    const { amount, currency, planid } = req.body;
    const option = {
      amount: amount * 100,
      currency,
      receipt: `receipt#${Math.floor(Math.random() * 1000)}`,
    };
    try {
      const order = await razorpay.orders.create(option);

      successResponse(res, order);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

// const verifyPayment = (req, res, next) => {
//   try {
//     // const payment = await;
//   } catch (error) {
//     next(error);
//   }
// };

const Stripe = require("stripe");
const stripe = new Stripe(
  "sk_test_51Q7CPV2NwyqqshlO3i5EBEWi29ItLOTBHcChojJzNuQqPhyEC9NXUDgcVzPm7wcMLI9sUfQED7lspip7a8VNAXhg00aSBnweYC"
);

const createPaymentIntent = async (req, res, next) => {
  try {
    const price = await stripe.prices.create({
      unit_amount: 1000, // Amount in cents, e.g., $10.00
      currency: "usd",
      product_data: {
        name: "Service Payment for October",
      },
    });

    console.log(price);

    const { amount, currency, description } = req.body; // Get amount, currency, and description from the request

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1, // Set the quantity
        },
      ],
    });

    res.send({ url: paymentLink.url });
  } catch (error) {
    next(error);
  }
};

const checkout = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "JavaScript T-Shirt",
            },
            unit_amount: 20 * 100,
          },
          quantity: 2,
        },
      ],
      mode: "payment",

      success_url: `${process.env.BASE_URL}/user/plan/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/user/plan/cancel`,
    });

    console.log(session);

    res.send(session.url); // Using 303 status for redirect
  } catch (error) {
    console.error("Error creating checkout session", error);
    res.status(500).send("Internal Server Error");
  }
};

const complete = async (req, res) => {
  const result = Promise.all([
    stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ["payment_intent.payment_method"] }),
    stripe.checkout.sessions.listLineItems(req.query.session_id),
  ]);

  console.log(JSON.stringify(await result));

  res.send("Your payment was successful");
};

const cancel = (req, res) => {
  res.send("payment cancel");
};

const hooks = async (req, res, next) => {
  try {
    let signingsecret = "whsec_9c1ba2fd6b24693b5bb659af25be828ea6432c5bb51b5d9ddf2a1441220ad486";
    const payload = req.body;
    const sig = req.header["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, signingsecret);
      console.log(event);
      console.log(event.data.objct);
      console.log(event.data.objct.id);
      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
      return 0;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, createPaymentIntent, checkout, complete, cancel };
