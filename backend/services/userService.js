import User from '../models/User.js'
import OTPModel from '../models/Otp.js'
import Address from '../models/Address.js'
import { sendOtpViaSMS } from '../utils/twilio.js'
import { createAccessToken, createRefreshToken } from '../utils/token.js'


export const sendOtpService = async (phone) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("OTP: ", otp)

    const sendedOTP = await sendOtpViaSMS(phone, otp)

    await OTPModel.findOneAndUpdate(
        { phone },
        { phone, otp, expiresAt: Date.now() + 5 * 60 * 1000 },
        { upsert: true, new: true }
    )

    return { success: true, message: "OTP sent Successfully", sendedOTP }
}


export const loginWithPhoneService = async (userDetails) => {
    const { phone, otp } = userDetails;

    if (!phone || !otp) {
        return { status: 400, success: false, message: "Phone number and OTP are required." };
    }

    const otpRecord = await OTPModel.findOne({ phone })

    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < Date.now()) {
        return { status: 401, success: false, message: "Invalid OTP" };
    }

    let user = await User.findOne({ phone });

    if (!user) {
        // Create new user if not exists
        user = await User.create({ phone });
    }

    const accessToken = createAccessToken({ id: user._id, phone: user.phone })
    const refreshToken = createRefreshToken({ id: user._id })

    user.refreshToken = refreshToken;
    await user.save();

    await OTPModel.deleteOne({ phone });


    return { status: 201, success: true, message: "User created successfully", user: { user, accessToken: accessToken } };
};


export const addAddressService = async (addressData) => {
    try {
        const newAddress = new Address(addressData);
        return await newAddress.save();
    } catch (error) {
        throw new Error("Database error while adding address");
    }
};

export const getUserAddressesService = async (userId) => {
    try {
        return await Address.find({ user: userId });
    } catch (error) {
        throw new Error("Database error while fetching addresses");
    }
};