const Property = require('../models/property.model')
const User = require('../models/user.model')
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
	const nights = +items.nights;
	const flag = items.petAllowed;
	const petNum = +items.petNum;

	// Retrieve property to get nightlyRate
	const property = await Property.findById(propertyId);
	const nightlyRate = +property.nightlyRate;
	let depositFee = 0
	let petAllowFee = 0
	if (property.depositFee) {
		depositFee = +property.depositFee;
	}
	if (flag && property.petAllowFee.fee) {
		petAllowFee = +property.petAllowFee.fee;
	}
	// Calculate the total price of the reservation
	const sum = nightlyRate * nights + depositFee + petAllowFee * petNum;
	const total = sum * 1065 / 1000;
	return total;

};



// Retrieve Reservation from ID
const ReservationFind = async Id => {

	const reservation = await Reservation.findOne({ paymentIntentId: Id }).populate('guest').exec()
	return reservation;
}


// Create a PaymentIntent with the order amount and currency
async function createIntent(req, res) {

	const items = req.body;
	const propertyId = items.propertyId;
	const property = await Property.findById(propertyId);
	const hostId = property.hostInfo.userId;
	if(req.user.id!=hostId){
		const host = await User.findById(hostId);
		if (host.stripe_account) {
			const stripe_account = host.stripe_account;
			const amount = parseInt((await calculateOrderAmount(items)) * 100);
			let account_amount = 0;
			if( property.manageType == "LEA"){
				account_amount = 80 * amount / 100;
			}
			else {
				account_amount = 97 * amount / 100;
			}
			const acc_amount = parseInt(account_amount);
			const paymentIntent = await stripe.paymentIntents.create({
				payment_method_types: ['card'],
				amount,
				currency: "usd",
				transfer_data: {
					amount: acc_amount,
					destination: stripe_account
				}
			});

			res.json({
				clientSecret: paymentIntent.client_secret
			});
		}
		else
			return res.json({ message: "There is no stripe account for this host" })
	}
	else{
		return res.json({message: "This property belongs to you"})
	}
	

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
		// 		paymentIntent = event.data.object;
		// 		reservation.paymentStatus = "Failed";
		// 		await reservation.save();
		// 		break;
	}

	return res.status(200);
}

module.exports = {
	createIntent,
	savePaymentStatus
}