import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the Cart Schema for TypeScript.
 * @param productId:string
 * @param name:string
 * @param img:string
 * @param color:string
 * @param size:number
 * @param price:number
 * @param quantity:number
 * @param total:number
 * @param timestamps:string
 */

export interface ICart extends Document {
    userId: string;
    productId: string;
    title:string;
    img:string;
    color:string;
    size:number;
    price:number;
    quantity: number,
    total:number
}

const cartSchema: Schema = new Schema({
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    title:{ type: String, required: true },
    img:{ type: String, required: true },
    color:{ type: String, required: true },
    size:{ type: Number, required: true },
    price:{ type: Number, required: true },
    quantity:{ type: Number,default:1 },
    total:{ type: Number }
}, { timestamps: true });

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
