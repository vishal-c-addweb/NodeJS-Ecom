import Product, { IProduct } from "../models/Product";
import { Response } from "express";
import Request from "../types/Request";
import { dataArray, responseFunction } from "../response_builder/responsefunction";
import responsecode from "../response_builder/responsecode";
require('dotenv').config();

const productController = {
    addProduct: async function addProduct(req: Request, res: Response) {
        const newProduct: IProduct = new Product(req.body);
        try {
            let product: any = await Product.findOne({ title: req.body.title });
            if (!product) {
                const savedProduct: any = await newProduct.save();
                let meta: object = { message: "Product save Successfully", status: "Success" };
                responseFunction(meta, savedProduct, responsecode.Created, res);
            } else {
                let meta: object = { message: "Product Already Register", status: "Failed" };
                responseFunction(meta, dataArray, responsecode.Forbidden, res);
            }
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    updateProduct: async function updateProduct(req: Request, res: Response) {
        try {
            const updatedProduct: IProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            let meta: object = { message: "Product Updated Successfully", status: "Success" };
            responseFunction(meta, updatedProduct, responsecode.Created, res);
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    deleteProduct: async function deleteProduct(req: Request, res: Response) {
        try {
            await Product.findByIdAndDelete(req.params.id);
            let meta: object = { message: "Product Deleted successfully", status: "Success" };
            responseFunction(meta, dataArray, responsecode.Success, res);
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
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
            if (qNew) {
                products = await Product.find().sort({createdAt:-1}).limit(1);
            } else if (qCategory) {
                products = await Product.find({
                    categories:{
                        $in: [qCategory],
                    }
                });
            } else {
                products = await Product.find(); 
            }
            let meta: object = { message: "Products Fetched successfully", status: "Success" };
            responseFunction(meta, products, responsecode.Success, res);
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    }
}

export default productController;