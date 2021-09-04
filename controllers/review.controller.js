const Review = require('../models/review.model')
const Property = require('../models/property.model')
const User = require('../models/user.model')




// create method creates Review from request's body and save that info to guest and property document
async function create(req, res){
    try{
        const review = new Review(req.body)
        review.guest = req.user.id
        await review.save()

        //Save review Info to Property Collection

        const property = await Property.findById({ _id: review.property })
        property.reviews.push(review);
        await property.save();

        //Save Review Info to User Collection
        
        // const guest = await User.findById(req.user.id)
        // guest.reservations.push(reservation);
        // await guest.save();

        res.status(200).json(review)

    }
    catch (err) {
        res.status(400).json({success: false, message:err.message})
     }
    
}


// findAll method returns all reviews and its related guest and property info
const findAll = (req, res) => {
    Review.find()
    .populate('guest').populate('property').exec(function(err, review){
        if (err) return handleError(err);

        res.json(review);
    });
}



// removeAll method removes all reviews
const removeAll = async (req, res) => {
    await Review.deleteMany()
    res.json({message: "success"})
}

// remove method removes only one specific review with ID
async function remove(req, res){
    try{
        const review = Review.findById(req.params.id).
            populate('guest').
            populate('property').
                exec(function (err, review) {
                    if (err) return handleError(err);

                    //remove review from guest reservations array
                    // User.findById(reservation.guest.id).then(guest => {
                    //     guest.reservations.pull(req.params.id);
                    //     guest.save();
                    // })
                    
                    //remove reservation from property reviews array
                    Property.findById(review.property.id).then(property => {
                        property.reviews.pull(req.params.id);
                        property.save();
                    });
                });

        //remove reservation
        await Review.findByIdAndRemove(req.params.id);

        res.status(200).json({success: true, data: review })

    }
    catch(err) {
        res.status(400).json({success: false, message:err.message})
    }
}

module.exports = {
    create,
    remove,
    findAll,
    removeAll
}