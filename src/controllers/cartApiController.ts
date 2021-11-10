import Cart, { ICart } from "../models/Cart";
import { Response } from "express";
import Request from "../types/Request";
import { dataArray, responseFunction } from "../response_builder/responsefunction";
import responsecode from "../response_builder/responsecode";
require('dotenv').config();

const cartController = {
    addToCart: async function addToCart(req: Request, res: Response) {
        const newCart: ICart = new Cart(req.body);
        try {
            const savedCart: any = await newCart.save();
            let meta: object = { message: "Product Added Successfully", status: "Success" };
            responseFunction(meta, savedCart, responsecode.Created, res);
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    updateCart: async function updateCart(req: Request, res: Response) {
        try {
            const updatedCart: ICart = await Cart.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            let meta: object = { message: "Cart Updated Successfully", status: "Success" };
            responseFunction(meta, updatedCart, responsecode.Created, res);
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },
    
    deleteCart: async function deleteCart(req: Request, res: Response) {
        try {
            await Cart.findByIdAndDelete(req.params.id);
            let meta: object = { message: "Cart Deleted successfully", status: "Success" };
            responseFunction(meta, dataArray, responsecode.Success, res);
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    getCart: async function getCart(req: Request, res: Response) {
        try {
            const cart: any = await Cart.find({userId: req.params.userId});
            if (cart) {
                let meta: object = { message: "Cart Fetched successfully", status: "Success" };
                responseFunction(meta, cart, responsecode.Success, res);
            } else {
                let meta: object = { message: "Cart not found", status: "Failed" };
                responseFunction(meta, dataArray, responsecode.Not_Found, res);
            }
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    getAllCart: async function getAllCart(req: Request, res: Response) {
        try {
            let cart: any = await Cart.find();
            if (cart) {    
                let meta: object = { message: "Cart Fetched successfully", status: "Success" };
                responseFunction(meta, cart, responsecode.Success, res);
            } else {
                let meta: object = { message: "Cart not found", status: "Failed" };
                responseFunction(meta, dataArray, responsecode.Not_Found, res); 
            }
        } 
        catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    }
}

export default cartController;