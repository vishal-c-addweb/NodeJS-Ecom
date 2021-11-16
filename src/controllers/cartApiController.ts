import Cart, { ICart } from "../models/Cart";
import { Response } from "express";
import Request from "../types/Request";
import { dataArray, responseFunction } from "../response_builder/responsefunction";
import responsecode from "../response_builder/responsecode";
import Product, { IProduct } from "../models/Product";
require('dotenv').config();


const cartController = {
    addToCart: async function addToCart(req: Request, res: Response) {
        let cart: any = await Cart.findOne({ userId:req.userId })
        try {
            if (!cart) {
                let savedCart: any = new Cart({
                    userId: req.userId,
                    products: [{
                        productId: req.params.id,
                        quantity: 1
                    }]
                })
                await savedCart.save();
                req.flash('msg', 'product added to wishlist');
                res.redirect('/cart');
            } else {
                let products = cart.products;
                let a = [];
                for (let i = 0; i < products.length; i++) {
                    a.push(products[i].productId);
                    if (products[i].productId === req.params.id) {
                        let quantity = products[i].quantity + 1;
                        await Cart.updateOne(
                            { userId: req.userId},
                            { $set: { ['products.'+i]: { productId: req.params.id,quantity:quantity } } }
                        );
                        res.redirect('/cart');
                    }
                }
                if (!a.includes(req.params.id)) {
                    await Cart.updateOne(
                        {_id:cart.id},
                        {$push:{products:[{productId: req.params.id,quantity: 1}]}}
                    );
                    req.flash('msg', 'product added to cart');
                    res.redirect('/cart');
                }
            }
        } catch (error) {
            req.flash('msg', 'Server error');
            res.redirect('/');
        }
    },

    removeFromCart: async function removeFromCart(req: Request, res: Response) {
        try {
            let cart: any = await Cart.findOne({ userId: req.userId });
            let products = cart.products;
            for (let i = 0; i < products.length; i++) {
                if (products[i].productId === req.params.id) {
                    let quantity: number = products[i].quantity - 1;
                    if (quantity > 0) {
                        await Cart.updateOne(
                            { userId: req.userId},
                            { $set: { ['products.'+i]: { productId: req.params.id,quantity:quantity } } }
                        );
                        res.redirect('/cart');
                    } else {
                        await Cart.updateOne(
                            { userId: req.userId },
                            { $pull: { 'products': { productId: req.params.id } } }
                        );
                        res.redirect('/cart');
                    }
                }
            }
        } catch (error) {
            req.flash('msg', 'Server error');
            res.redirect('/');
        }
    },
    
    clearCart: async function clearCart(req: Request, res: Response) {
        try {
            await Cart.updateOne(
                { userId: req.userId },
                { $pull: { 'products': { productId: req.params.id } } }
            );
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