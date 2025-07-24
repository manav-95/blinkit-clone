import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    refreshToken: {
        type: String
    },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
export default User;