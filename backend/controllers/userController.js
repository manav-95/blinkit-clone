import { addAddressService, getUserAddressesService, loginWithPhoneService, sendOtpService } from "../services/userService.js";
import { createAccessToken } from "../utils/token.js";
import User from '../models/User.js'
import jwt from 'jsonwebtoken'



export const refreshAccessToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ success: false, message: 'No refresh token found' });

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ success: false, message: 'Refresh token is invalid or expired' });
        }

        const newAccessToken = createAccessToken(
            { id: user._id, phone: user.phone },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        return res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Token expired or invalid' });
    }
};


export const sendOTP = async (req, res) => {
    try {
        // console.log("Incoming body:", req.body);
        const phone = req.body.phone;
        const result = await sendOtpService(phone)
        return res.status(201).json({ success: result.success, message: result.message })
    } catch (error) {
        console.log("Error Creating otp: ", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error while creating otp" })
    }
}

export const loginWithPhone = async (req, res) => {
    try {
        const userDetails = req.body;
        // console.log("User Details: ", userDetails)
        const userResponse = await loginWithPhoneService(userDetails)
        res.cookie('refreshToken', userResponse.user.user.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(userResponse.status).json({ success: userResponse.success, message: userResponse.message, user: userResponse.user || null })
    } catch (error) {
        console.log("Error Creating user: ", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error while creating user" })
    }
}


export const logout = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decoded.id);
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        } catch (err) {
            return res.status(400).json({ success: false, message: 'Error Logging out' });
        }
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    });

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
};


export const addAddress = async (req, res) => {
    try {
        const addressData = req.body;
        if (!addressData) {
            return res.status(400).json({ success: false, message: "Address is required" });
        }
        const savedAddress = await addAddressService(addressData);
        return res.status(201).json({ success: true, message: 'Address Added Successfully', savedAddress })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Error Adding Address' });
    }

}

export const getUserAddresses = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is Required" })
        }

        const addresses = await getUserAddressesService(userId);
        return res.status(200).json({ success: true, message: "User Addresses Found Successfully", addresses: addresses })
    } catch (error) {
        console.log("Error Fetching User Addresses: ", error.message)
        return res.status(400).json({ success: false, message: "Error Fetching User Addresses" })
    }
}