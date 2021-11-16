import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the Cart Schema for TypeScript.
 * @param productId:string
 * @param products:array
 */

export interface ICart extends Document {
    userId:string;
    products: [{
        productId: string,
        quantity: number,
        _id: false
    }];
}

const cartSchema: Schema = new Schema({
    userId: { type: String, required: true },
    products: [{
        productId: { type: String, required: true },
        quantity:{ type: Number,default:1 },
        _id:false
    }]
}, { timestamps: true });

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
