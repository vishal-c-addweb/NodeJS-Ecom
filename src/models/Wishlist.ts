import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the Cart Schema for TypeScript.
 * @param userId:string
 * @param productId:string
 * @param name:string
 * @param img:string
 * @param price:number
 */

export interface IWishlist extends Document {
    userId:string;
    productId: string;
    title:string;
    img:string;
    price:number;
}

const wishlistSchema: Schema = new Schema({
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    title:{ type: String, required: true },
    img:{ type: String, required: true },
    price:{ type: Number, required: true }
}, { timestamps: true });

const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
