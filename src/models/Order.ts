import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the Order Schema for TypeScript.
 * @param userId:string
 * @param products:array
 * @param amount:number
 * @param address:object
 * @param status:string
 * @param timestamps:string    
 */

export interface IOrder extends Document {
    userId: string;
    products: [{
        productId: string,
        quantity: number,
        _id: false
    }];
    amount: number;
    address: object;
    status: string;
}

const orderSchema: Schema = new Schema({
    userId: { type: String, required: true },
    products: [{
        productId: { type: String },
        quantity: { type: Number, default: 1 },
        _id: false
    }],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
}, { timestamps: true });

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
