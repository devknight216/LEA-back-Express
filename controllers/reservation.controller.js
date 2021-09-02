const Reservation = require('../models/reservation.model')
const Property = require('../models/property.model')
const User = require('../models/user.model')

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

const findOne = (req, res) => {
    
    Reservation.findById(req.params.id)
        .populate('guest').populate('property').exec(function(err, reservation){
            if (err) return handleError(err);

            res.json(reservation);
        });
}

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
    findOne
}