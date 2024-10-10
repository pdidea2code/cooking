const Stripe = require("stripe");
const Plan = require("../../models/Plan");
const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const Payment = require("../../models/Payment");
const Plandetail = require("../../models/Plandetail");
const User = require("../../models/User");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getPlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const plandetail = await Plandetail.findOne({ userid: req.user._id }).sort({ createdAt: -1 }).lean();

    if (plandetail) {
      user.issubscribe = plandetail.planexpire > Date.now();
      await user.save();
    } else {
      user.issubscribe = false;
      await user.save();
    }

    const plans = await Plan.find({ status: true }).lean();
    if (!plans.length) {
      return queryErrorRelatedResponse(req, res, 404, "Plan not found");
    }

    const modifiedPlans = plans.map((data) => {
      const isMatch = plandetail && data._id.equals(plandetail.planid) && plandetail.planexpire > Date.now();
      return {
        ...data,
        issubscribe: isMatch ? true : false,
      };
    });

    successResponse(res, modifiedPlans);
  } catch (error) {
    next(error);
  }
};

const checkout = async (req, res, next) => {
  try {
    const plandetail = await Plandetail.findOne({ userid: req.user._id }).sort({ createdAt: -1 });

    if (plandetail && plandetail.planexpire > Date.now()) {
      return queryErrorRelatedResponse(req, res, 400, "your plan alrady exist");
    }

    const plan = await Plan.findOne({ _id: req.body.id });

    if (!plan) return queryErrorRelatedResponse(req, res, 404, "Plan not found");

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.duration} plan`,
            },
            unit_amount: plan.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/user/plan/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/user/plan/cancel`,
    });

    const payment = await Payment.create({
      userid: req.user._id,
      planid: req.body.id,
      status: "created",
      sessionId: session.id,
      amount: plan.amount,
      currency: session.currency,
    });
    // res.redirect(303, session.url);
    successResponse(res, session.url);
  } catch (error) {
    console.error("Error creating checkout session", error);
    next(error);
  }
};

const complete = async (req, res, next) => {
  try {
    const [session, lineItems] = await Promise.all([
      stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ["payment_intent.payment_method"] }),
      stripe.checkout.sessions.listLineItems(req.query.session_id),
    ]);

    if (session.payment_intent?.status !== "succeeded") {
      return queryErrorRelatedResponse(req, res, 400, session.payment_status);
    }

    const payment = await Payment.findOne({ sessionId: session.id });
    if (!payment) {
      return queryErrorRelatedResponse(req, res, 404, "Payment not found");
    }

    const plandetail = await Plandetail.findOne({ userid: payment.userid, paymentid: payment._id });
    if (plandetail) return queryErrorRelatedResponse(req, res, 200, "Payment was successful");

    payment.status = session.payment_intent?.status || "failed";
    payment.paymentId = session.payment_intent?.id || null;

    if (session.status)
      if (session.payment_intent?.status === "succeeded") {
        const plan = await Plan.findOne({ _id: payment.planid });
        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        futureDate.setUTCDate(currentDate.getUTCDate() + plan.day);
        const timestamp = futureDate.getTime();

        await Plandetail.create({
          userid: payment.userid,
          planid: payment.planid,
          paymentid: payment._id,
          planexpire: timestamp,
        });

        const user = await User.findOne({ _id: payment.userid });
        user.issubscribe = true;
        await user.save();
      }

    await payment.save();

    res.send(`
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Success</title>
    <style>
        body {
            background: #999;
        }

        .container {
            max-width: 380px;
            margin: 30px auto;
            overflow: hidden;
        }

        .printer-top {
            z-index: 1;
            border: 6px solid #666666;
            height: 6px;
            border-bottom: 0;
            border-radius: 6px 6px 0 0;
            background: #333333;
        }

        .printer-bottom {
            z-index: 0;
            border: 6px solid #666666;
            height: 6px;
            border-top: 0;
            border-radius: 0 0 6px 6px;
            background: #333333;
        }

        .paper-container {
            position: relative;
            overflow: hidden;
            height: 467px;
        }

        .paper {
            background: #ffffff;
            height: 447px;
            position: absolute;
            z-index: 2;
            margin: 0 12px;
            margin-top: -12px;
            animation: print 1800ms cubic-bezier(0.68, -0.55, 0.265, 0.9);
        }

        .main-contents {
            margin: 0 12px;
            padding: 24px;
        }

        .jagged-edge {
            position: relative;
            height: 20px;
            width: 100%;
            margin-top: -1px;
        }

        .jagged-edge:after {
            content: "";
            display: block;
            position: absolute;
            left: 0;
            right: 0;
            height: 20px;
            background: linear-gradient( 45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%), linear-gradient( -45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%);
            background-size: 16px 40px;
            background-position: 0 -20px;
        }

        .success-icon {
            text-align: center;
            font-size: 48px;
            height: 72px;
            background: #359d00;
            border-radius: 50%;
            width: 72px;
            margin: 18px auto;
            color: #fff;
        }

        .success-title {
            font-size: 22px;
            text-align: center;
            color: #666;
            font-weight: bold;
            margin-bottom: 16px;
        }

        .success-description {
            font-size: 15px;
            line-height: 21px;
            color: #999;
            text-align: center;
            margin-bottom: 24px;
        }

        .order-footer {
            text-align: center;
            line-height: 18px;
            font-size: 18px;
            margin-bottom: 8px;
            font-weight: bold;
            color: #999;
        }

        @keyframes print {
            0% {
                transform: translateY(-90%);
            }
            100% {
                transform: translateY(0%);
            }
        }
    </style>
</head>
<body>

<div class="container">
    <div class="printer-top"></div>
    
    <div class="paper-container">
        <div class="printer-bottom"></div>

        <div class="paper">
            <div class="main-contents">
                <div class="success-icon">&#10004;</div>
                <div class="success-title">Payment Complete</div>
                <div class="success-description">
                    Your payment has been received successfully.
                </div>
                <div class="order-footer">You can close this page!</div>
            </div>
            <div class="jagged-edge"></div>
        </div>
    </div>
</div>

</body>
</html>



`);
  } catch (error) {
    console.error("Error occurred:", error);
    next(error);
  }
};

const cancel = (req, res, next) => {
  try {
    res.send("payment cancel");
  } catch (error) {
    next(error);
  }
};

module.exports = { checkout, complete, cancel, getPlan };
