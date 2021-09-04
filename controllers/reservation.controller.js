const Reservation = require('../models/reservation.model')
const Property = require('../models/property.model')
const User = require('../models/user.model')




// create method creates reservation from request's body and save that info to guest and property document
async function create(req, res){
    try{
        const reservation = new Reservation(req.body)
        reservation.guest = req.user.id
        await reservation.save()

        //Save reservation Info to Property Collection

        const property = await Property.findById({ _id: reservation.property })
        property.reservations.push(reservation);
        await property.save();

        //Save Reservation Info to User Collection
        
        const guest = await User.findById(req.user.id)
        guest.reservations.push(reservation);
        await guest.save();

        res.status(200).json(reservation)

    }
    catch (err) {
        res.status(400).json({success: false, message:err.message})
     }
    
}


// findOne method returns only one reservation and it's guest and property info from reservation ID
const findOne = (req, res) => {
    
    Reservation.findById(req.params.id)
        .populate('guest').populate('property').exec(function(err, reservation){
            if (err) return handleError(err);

            res.json(reservation);
        });
}

// findAll method returns all reservations and its related guest and property info
const findAll = (req, res) => {
    Reservation.find()
    .populate('guest').populate('property').exec(function(err, reservation){
        if (err) return handleError(err);

        res.json(reservation);
    });
}

// Get property Reservations by HostId
const getByUserId = (req, res) => {
    const userId = req.params.id;
    Property.find({ host: userId }).populate('reservations').exec(function(err, properties){
        if (err) return handleError(err);

        res.json(properties);
    });
}

// updateStatus method only updates the reservation status and payment status
const updateStatus = async (req,res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        
        reservation.status = await req.body.status;
        reservation.paymentStatus = await req.body.status;
        await reservation.save();   
        
        res.status(200).json(reservation);
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
    
}

// removeAll method removes all reservations
const removeAll = async (req, res) => {
    await Reservation.deleteMany()
    res.json({message: "success"})
}

// remove method removes only one specific reservation with ID
async function remove(req, res){
    try{
        const reservation = Reservation.findById(req.params.id).
            populate('guest').
            populate('property').
                exec(function (err, reservation) {
                    if (err) return handleError(err);

                    //remove reservation from guest reservations array
                    User.findById(reservation.guest.id).then(guest => {
                        guest.reservations.pull(req.params.id);
                        guest.save();
                    })
                    
                    //remove reservation from property reservations array
                    Property.findById(reservation.property.id).then(property => {
                        property.reservations.pull(req.params.id);
                        property.save();
                    });
                });

        //remove reservation
        await Reservation.findByIdAndRemove(req.params.id);

        res.status(200).json({success: true, data: reservation })

    }
    catch(err) {
        res.status(400).json({success: false, message:err.message})
    }
}

module.exports = {
    create,
    remove,
    findOne,
    updateStatus,
    findAll,
    removeAll,
    getByUserId
}