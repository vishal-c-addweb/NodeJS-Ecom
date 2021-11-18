import config from "config";
import Product, { IProduct } from "../models/Product";
import { Response } from "express";
import Request from "../types/Request";
import { dataArray, responseFunction } from "../response_builder/responsefunction";
import responsecode from "../response_builder/responsecode";
import Wishlist, { IWishlist } from "../models/Wishlist";
const jwt = require('jsonwebtoken');
require('dotenv').config();

const productController = {
    addProduct: async function addProduct(req: Request, res: Response) {
        try {
            if (req.isAdmin) {
                let product: any = await Product.findOne({ title: req.body.title });
                if (!product) {
                    const newProduct: IProduct = new Product({
                        title: req.body.title,
                        desc: req.body.desc,
                        img: req.file.filename,
                        categories: req.body.categories,
                        size: req.body.size,
                        color: req.body.color,
                        price: req.body.price,
                        availableStock: req.body.availableStock
                    });
                    const savedProduct: any = await newProduct.save();
                    req.flash('msg','product successfully added');
                    res.redirect('/admin/products');
                } else {
                    req.flash('msg', 'Product Already Register');
                    res.redirect('/');
                }
            }
            else {
                res.redirect('/');
            }
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
            req.flash('msg', 'server error');
            res.redirect('/');
        }
    },

    updateProduct: async function updateProduct(req: Request, res: Response) {
        console.log(req.file.filename);
        try {
            const updatedProduct: IProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    title: req.body.title,
                    desc: req.body.desc,
                    img: req.file.filename,
                    categories: req.body.categories,
                    size: req.body.size,
                    color: req.body.color,
                    price: req.body.price,
                    availableStock: req.body.availableStock
                }
            );
            req.flash('msg','product successfully updated');
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    },

    deleteProduct: async function deleteProduct(req: Request, res: Response) {
        try {
            if (req.isAdmin) {
                await Product.findByIdAndDelete(req.params.id);
                req.flash('msg','Product Deleted Successfully')
                res.redirect('/admin/products')
            }
            else {
                res.redirect('/');
            }
        } catch (error) {
            req.flash('msg','server error')
            res.redirect('/admin/products')
        }
    },

    getProduct: async function getProduct(req: Request, res: Response) {
        try {
            const product: any = await Product.findById(req.params.id);
            if (product) {
                let meta: object = { message: "Product Fetched successfully", status: "Success" };
                responseFunction(meta, product, responsecode.Success, res);
            } else {
                let meta: object = { message: "product not found", status: "Failed" };
                responseFunction(meta, dataArray, responsecode.Not_Found, res);
            }
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    getAllProduct: async function getAllProduct(req: Request, res: Response) {
        const qNew = req.query.new;
        const qCategory = req.query.category;
        try {
            let products;
            if (req.isAdmin) {
                if (qNew) {
                    products = await Product.find().sort({ createdAt: -1 }).limit(1);
                } else if (qCategory) {
                    products = await Product.find({
                        categories: {
                            $in: [qCategory],
                        }
                    });
                } else {
                    products = await Product.find();
                }
                res.render('admin/products.ejs', { products: products });
            }
            else {
                res.redirect('/');
            }
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    addToWishlist: async function addToWishlist(req: Request, res: Response) {
        let wishlist: any = await Wishlist.findOne({ userId: req.userId })
        try {
            if (!wishlist) {
                let product: IProduct = await Product.findById(req.params.id);
                let savedWishlist: any = new Wishlist({
                    userId: req.userId,
                    products: [{
                        productId: product.id
                    }]
                })
                await savedWishlist.save();
                req.flash('msg', 'product added to wishlist');
                res.redirect('/wishlist');
            } else {
                let products = wishlist.products;
                let a = [];
                for (let i = 0; i < products.length; i++) {
                    a.push(products[i].productId);
                    if (products[i].productId === req.params.id) {
                        req.flash('msg', 'product already in wishlist');
                        res.redirect('/wishlist');
                    }
                }
                if (!a.includes(req.params.id)) {
                    await Wishlist.updateOne(
                        { _id: wishlist.id },
                        { $push: { products: [{ productId: req.params.id }] } }
                    );
                    req.flash('msg', 'product added to wishlist');
                    res.redirect('/wishlist');
                }
            }
        } catch (error) {
            req.flash('msg', 'Server error');
            res.redirect('/');
        }
    },

    deleteFromWishlist: async function deleteFromWishlist(req: Request, res: Response) {
        try {
            let wishlist: any = await Wishlist.findOne({ userId: req.userId });
            let products = wishlist.products;
            for (let i = 0; i < products.length; i++) {
                if (products[i].productId === req.params.id) {
                    await Wishlist.updateOne(
                        { userId: req.userId },
                        { $pull: { 'products': { productId: req.params.id } } }
                    );
                    req.flash('msg', 'product removed from wishlist');
                    res.redirect('/wishlist');
                }
            }
        } catch (error) {
            req.flash('msg', 'Server error');
            res.redirect('/wishlist');
        }
    },
}

export default productController;