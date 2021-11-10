import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param userName:string
 * @param email:email
 * @param password:string
 * @param isAdmin:boolean
 * @param timestamps:string
 */

export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

const userSchema: Schema = new Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
