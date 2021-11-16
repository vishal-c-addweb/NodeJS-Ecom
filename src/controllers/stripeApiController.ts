import Cart, { ICart } from "../models/Cart";
import { Response } from "express";
import Request from "../types/Request";
import { dataArray, responseFunction } from "../response_builder/responsefunction";
import responsecode from "../response_builder/responsecode";
require('dotenv').config();


const stripeController = {
    payment: async function payment(req: Request, res: Response) {
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


    order: async function order(req: Request, res: Response) {
        try {
            let cart:any = await Cart.find({userId:req.userId});
            res.render('product/payment.ejs',{
                key: process.env.PUBLISH_API_KEY
            });
        } catch (error) {
            req.flash('msg', 'Server error');
            res.redirect('/');
        }
    }
}

export default stripeController;