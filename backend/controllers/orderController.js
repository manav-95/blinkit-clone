import { createOrderService, getAllUserOrdersService } from "../services/orderService.js";


export const createOrder = async (req, res) => {
    const orderDetails = req.body;
    try {
        const order = await createOrderService(orderDetails);
        if (order) {
            console.log("Order Created Successfully")
            return res.status(201).json({ success: true, message: "Order Successfully Created", order })
        }
    } catch (error) {
        console.log("Error While Creating Order", error.message)
        return res.status(400).json({ success: false, message: "Order Creation Failed" })
    }
}

export const getAllUserOrders = async (req, res) => {
    const { userId } = req.params;
    try {
        const userOrders = await getAllUserOrdersService(userId);
        if (userOrders) {
            return res.status(200).json({ success: true, message: "ALL Orders Of User Successfully Fetched", userOrders })
        }
    } catch (error) {
        console.log("Error: ", error.message)
        return res.status(400).json({ success: false, message: "Failed To Fetch User Orders" })
    }
}