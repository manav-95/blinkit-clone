import mongoose from 'mongoose'

const AddressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        require: true,
    },
    area: {
        type: String,
        required: true,
    },
    addressType: {
        type: String,
        enum: ['Home', 'Office', 'Other'],
        default: 'Home',
    },
    flatName: String,
    landmark: String,
    floor: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

}, { timestamps: true })

const Address = mongoose.model("Address", AddressSchema)

export default Address;