import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the Cart Schema for TypeScript.
 * @param userId:string
 * @param products:array
 */

export interface IWishlist extends Document {
    userId:string;
    products: [{
        productId: string
    }];
}

const wishlistSchema: Schema = new Schema({
    userId: { type: String, required: true },
    products: [{
        productId: { type: String, required: true }
    }]
}, { timestamps: true });

const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
