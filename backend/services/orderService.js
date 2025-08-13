import Order from "../models/Order.js"


export const createOrderService = async (orderData) => {
    try {
        const order = new Order(orderData);
        return await order.save();
    } catch (error) {
        throw new Error("DB Error while Creating/Saving Order")
    }
}

export const getAllUserOrdersService = async (userId) => {
    try {
        return await Order.find({ user: userId })
    } catch (error) {
        throw new Error("Error Fetching All User Orders")
    }
}