const Property = require('../models/property.model')
const Reservation = require('../models/reservation.model')

const stripeTestKey = process.env.STRIPE_SECRET_TEST_KEY;
// This is a sample test API key. Sign in to see examples pre-filled with your key.
const stripe = require("stripe")(stripeTestKey);


const calculateOrderAmount = async items => {

    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    const propertyId = items.propertyId;
    const guestNum = parseInt(items.adultNum) + parseInt(items.childrenNum);
    const serviceFee = parseInt(items.serviceFee);

    // Retrieve property to get nightlyRate
    const property = await Property.findById(propertyId);
    const nightlyRate = property.nightlyRate;

    // Calculate the total price of the reservation
    const total = nightlyRate * guestNum + serviceFee;
    return total;
    
};



// Retrieve Reservation from ID
const ReservationFind = async Id => {
    
    const reservation = await Reservation.find({paymentIntentId: Id});
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
    const paymentIntent = null;
    const reservation = await ReservationFind(paymentIntent.id);
    switch (event.type) {
        case 'payment_intent.succeeded':
            paymentIntent = event.data.object;
            reservation.paymentStatus = "Success";
            await reservation.save();
            break;
        case 'payment_intent.payment_failed':
            paymentIntent = event.data.object;
            reservation.paymentStatus = "Failed";
            await reservation.save();
            break;
    }

    return res.status(200);
}

module.exports = {
    createIntent,
    savePaymentStatus
}