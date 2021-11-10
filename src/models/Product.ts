import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the Product Schema for TypeScript.
 * @param title:string
 * @param desc:string
 * @param img:string
 * @param categories:array
 * @param size:string
 * @param color:string
 * @param price:number
 */

export interface IProduct extends Document {
    title: string;
    desc: string;
    img: string;
    categories: Array<{}>;
    size: string;
    color: string;
    price: number;
}

const productSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
