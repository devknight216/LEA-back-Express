const Property = require('../models/property.model')
const Reservation = require('../models/reservation.model')
const twilio = require('../service/twilio')
const sendgrid = require('../service/sendgrid')

const stripeTestKey = process.env.STRIPE_SECRET_TEST_KEY;
// This is a sample test API key. Sign in to see examples pre-filled with your key.
const stripe = require("stripe")(stripeTestKey);


const calculateOrderAmount = async items => {

    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    const propertyId = items.propertyId;
    const nights = items.nights;

    // Retrieve property to get nightlyRate
    const property = await Property.findById(propertyId);
    const nightlyRate = property.nightlyRate;
    const depositFee = property.depositFee;
    const petAllowFee = property.petAllowFee;

    // Calculate the total price of the reservation
    const total = nightlyRate * nights + depositFee + petAllowFee;
    return total;
    
};



// Retrieve Reservation from ID
const ReservationFind = async Id => {
    
    const reservation = await Reservation.findOne({paymentIntentId: Id}).populate('guest').exec()
    return reservation;
}


// Create a PaymentIntent with the order amount and currency
async function createIntent( req, res) {

    const items = req.body;
    const amount = await calculateOrderAmount(items);
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd"
    });
    
    res.json({
        clientSecret: paymentIntent.client_secret
    });
}


// Save Payment Status to DB after Stripe sends the success or failure event to backend
// Send mail or sms to the guest after payment succeeds or fails
const savePaymentStatus = async (req, res) => {
    const event = req.body;
    //const paymentIntent = null;
    
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            const reservation = await ReservationFind(paymentIntent.id);
            reservation.paymentStatus = "Success";
            await reservation.save();

            const to = reservation.guest.phone;
            const body = "Your payment intent succeeded";
            twilio.sendSMS(body, to);

            // const toEmail = reservation.guest.email;
            // const subject = "Notification from LEA";
            // const text = "Your payment intent succeeded";
            // const html = "<strong>Your payment intent succeeded</strong>";
            // sendgrid.sendEmail(toEmail, subject, text, html);

            break;
        // case 'payment_intent.payment_failed':
        //     paymentIntent = event.data.object;
        //     reservation.paymentStatus = "Failed";
        //     await reservation.save();
        //     break;
    }

    return res.status(200);
}

module.exports = {
    createIntent,
    savePaymentStatus
}