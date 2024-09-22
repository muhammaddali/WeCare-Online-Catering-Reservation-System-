import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/order.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import { isAuth, isAdmin } from "../utils.js";
import JazzcashService from "../jaazcashService.js";

const orderRouter = express.Router();

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: [...req.body.orderItems],
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    try {
      const order = await (await newOrder.save()).populate("orderItems");
      res.status(201).send({ message: "New Order Created", order });
    } catch (error) {
      const errorMessage =
        error.message || "Error while creating order. Please try again.";
      res.status(500).send({ message: errorMessage });
    }
  })
);

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let query = {
      user: req.user._id,
    };

    if (req.user.isAdmin) {
      query = {};
    }

    const orders = await Order.find(query);
    res.send(orders);
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("orderItems");
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter
  .route("/:id")
  .patch(
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const { isDelivered } = req.body;

      try {
        const order = await Order.findOneAndUpdate(
          { _id: req.params.id },
          { $set: { isDelivered: isDelivered, deliveredAt: Date.now() } },
          { new: true }
        );

        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    })
  )
  .delete(
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      try {
        const orderId = req.params.id;
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
          return res.status(404).json({ message: "Order not found" });
        }

        res.status(204).json({ message: "Order deleted successfully" });
      } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    })
  );

orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
      paymentMethod,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      phoneNumber,
      cnic,
    } = req.body;

    const { id } = req.params;

    try {
      const order = await Order.findById(id)
        .populate("orderItems")
        .populate("user");

      if (order) {
        const jazzcashService = new JazzcashService();

        // const response = await jazzcashService.createPaymentRequest();
        // console.log(response);

        const isPaid = await jazzcashService.processPayment({
          refId: order.id,
          amount: order.totalPrice,
          phoneNumber: phoneNumber,
          cnic,
        });

        if (isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          const updatedOrder = await order.save();
          res.status(200).send({ message: "Order Paid", order: updatedOrder });
        } else {
          res.status(500).send({
            message: "Error while processing payment. Please try again leter.",
          });
        }
      } else {
        res.status(404).send({ message: "Order Not Found" });
      }
    } catch (error) {
      console.log(error);
    }
  })
);
export default orderRouter;
