import Cart, { ICart } from "../models/Cart";
import { Response } from "express";
import Request from "../types/Request";
import { dataArray, responseFunction } from "../response_builder/responsefunction";
import responsecode from "../response_builder/responsecode";
import Product, { IProduct } from "../models/Product";
require('dotenv').config();

const cartController = {
    addToCart: async function addToCart(req: Request, res: Response) {
        const cart: any = await Cart.findOne({ userId: req.userId, productId: req.params.id });
        try {
            if (!cart) {
                let product: IProduct = await Product.findById(req.params.id);
                let savedCart: any = new Cart({
                    userId: req.userId,
                    productId: product.id,
                    title: product.title,
                    img: product.img,
                    color: product.color,
                    size: product.size,
                    price: product.price,
                    total: product.price
                })
                await savedCart.save();
                req.flash('msg', 'product added to cart');
                res.redirect('/cart');
            } else {
                let quantity = cart.quantity + 1;
                let total = cart.price * quantity;
                await Cart.findOneAndUpdate({ _id: cart.id }, { $set: { quantity: quantity, total: total } });
                res.redirect('/cart');
            }
        } catch (error) {
            req.flash('msg', 'Server error');
            res.redirect('/');
        }
    },

    removeFromCart: async function removeFromCart(req: Request, res: Response) {
        const cart: any = await Cart.findOne({ userId: req.userId, productId: req.params.id });
        try {
            let quantity = cart.quantity - 1;
            let total = cart.price * quantity;
            if (quantity > 0) {
                await Cart.findOneAndUpdate({ _id: cart.id }, { $set: { quantity: quantity, total: total } });
            } else {
                await Cart.findByIdAndDelete({ _id: cart.id });
            }
            res.redirect('/cart');
        } catch (error) {
            req.flash('msg', 'Server error');
            res.redirect('/');
        }
    },
    
    clearCart: async function clearCart(req: Request, res: Response) {
       const cart: any = await Cart.findOne({ userId: req.userId, productId: req.params.id });
        try {
            await Cart.findByIdAndDelete({ _id: cart.id });
            res.redirect('/cart');
        } catch (error) {
            req.flash('msg', 'Server error');
            res.redirect('/');
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
            const cart: any = await Cart.find({ userId: req.params.userId });
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