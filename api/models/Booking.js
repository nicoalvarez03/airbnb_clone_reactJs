const moongoose = require('mongoose');

const bookingSchema = new moongoose.Schema({
    place: {
        type: moongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Place'
    },
    user: {
        type: moongoose.Schema.Types.ObjectId,
        required: true,
    },
    checkIn: {type: Date, required: true},
    checkOut: {type: Date, required: true},
    numberOfGuests: {type: Number, required: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    price: Number,
});

const BookingModel = moongoose.model('Booking', bookingSchema);

module.exports = BookingModel;