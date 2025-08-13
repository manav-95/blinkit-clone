import express from "express"
import { createOrder, getAllUserOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-order", createOrder);

router.get("/:userId/userOrders", getAllUserOrders);

export default router;