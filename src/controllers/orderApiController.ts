import Order, { IOrder } from "../models/Order";
import { Response } from "express";
import Request from "../types/Request";
import { dataArray, responseFunction } from "../response_builder/responsefunction";
import responsecode from "../response_builder/responsecode";
require('dotenv').config();

const orderController = {
    addOrder: async function addOrder(req: Request, res: Response) {
        const newOrder: IOrder = new Order(req.body);
        try {
            const savedOrder: any = await newOrder.save();
            let meta: object = { message: "Product Ordered Successfully", status: "Success" };
            responseFunction(meta, savedOrder, responsecode.Created, res);
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    updateOrder: async function updateOrder(req: Request, res: Response) {
        try {
            const updatedOrder: IOrder = await Order.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            let meta: object = { message: "Order Updated Successfully", status: "Success" };
            responseFunction(meta, updatedOrder, responsecode.Created, res);
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    deleteOrder: async function deleteOrder(req: Request, res: Response) {
        try {
            await Order.findByIdAndDelete(req.params.id);
            let meta: object = { message: "Order Deleted successfully", status: "Success" };
            responseFunction(meta, dataArray, responsecode.Success, res);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    getOrder: async function getOrder(req: Request, res: Response) {
        try {
            const order: any = await Order.findOne({ userId: req.params.userId });
            if (order) {
                let meta: object = { message: "Order Fetched successfully", status: "Success" };
                responseFunction(meta, order, responsecode.Success, res);
            } else {
                let meta: object = { message: "Order not found", status: "Failed" };
                responseFunction(meta, dataArray, responsecode.Not_Found, res);
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    getAllOrder: async function getAllOrder(req: Request, res: Response) {
        try {
            let orders: any = await Order.find();
            if (orders) {
                let meta: object = { message: "Cart Fetched successfully", status: "Success" };
                responseFunction(meta, orders, responsecode.Success, res);
            } else {
                let meta: object = { message: "Cart not found", status: "Failed" };
                responseFunction(meta, dataArray, responsecode.Not_Found, res);
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    getMonthlyIncome: async function getMonthlyIncome(req: Request, res: Response) {
        const date: Date = new Date();
        const lastMonth: Date = new Date(date.setMonth(date.getMonth() - 1));
        const previousMonth: Date = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
        try {
            const income: any = await Order.aggregate([
                { $match: { createdAt: { $gte: previousMonth } } },
                {
                    $project: {
                        month: { $month: "$createdAt" },
                        sales: "$month",
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        total: { $sum: "$sales" },
                    },
                },
            ]);
            if (income) {
                let meta: object = { message: "Income Fetched successfully", status: "Success" };
                responseFunction(meta, income, responsecode.Success, res);
            } else {
                let meta: object = { message: "Income not found", status: "Failed" };
                responseFunction(meta, dataArray, responsecode.Not_Found, res);
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default orderController;