import config from "config";
import User, { IUser } from "../models/User";
import { Response } from "express";
import Request from "../types/Request";
import { dataArray, responseFunction } from "../response_builder/responsefunction";
import responsecode from "../response_builder/responsecode";
import { mailService } from "../services/mail";
import { LocalStorage } from "node-localstorage";
global.localStorage = new LocalStorage('./scratch');
import bcrypt from "bcryptjs";
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userController = {
    register: async function register(req: Request, res: Response) {
        try {
            let user: any = await User.findOne({ userName: req.body.userName });
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            if (!user) {
                let newUser: IUser = new User({
                    userName: req.body.userName,
                    email: req.body.email,
                    password: hashed
                });
                const savedUser: any = await newUser.save();
                // await mailService(req.body.email, req.body.userName, req.body.password);
                // let meta: object = { message: "Registered Successfully", status: "Success" };
                // responseFunction(meta, savedUser, responsecode.Created, res);
                req.flash('msg', 'successfully registered');
                res.redirect('/login');
            } else {
                // let meta: object = { message: "User Already Register", status: "Failed" };
                // responseFunction(meta, dataArray, responsecode.Forbidden, res);
                req.flash('msg', 'already registered');
                res.redirect('/register');
            }
        } catch (error) {
            // let meta: object = { message: "Server error", status: "Failed" };
            // responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
            res.redirect('/register');
        }
    },

    login: async function login(req: Request, res: Response) {
        try {
            const user: any = await User.findOne({ email: req.body.email });
            if (user) {
                const isMatch = await bcrypt.compare(req.body.password, user.password);
                if (isMatch) {
                    const { password, ...others } = user._doc;
                    const token: string = jwt.sign(
                        { user_id: user._id, user_isAdmin: user.isAdmin },
                        config.get("jwtSecret"),
                        { expiresIn: config.get("jwtExpiration") }
                    );
                    let data: object = {
                        "data": others,
                        "token": token
                    };
                    // let meta: object = { message: "logged in successfully", status: "Success" };
                    // responseFunction(meta, data, responsecode.Success, res);
                    res.cookie('auth', token);
                    req.flash('msg', 'logged in successfully');
                    res.redirect('/');
                } else {
                    // let meta: object = { message: "wrong credential", status: "Failed" };
                    // responseFunction(meta, dataArray, responsecode.Forbidden, res);
                    req.flash('msg', 'wrong credential');
                    res.redirect('/login');
                }
            } else {
                // let meta: object = { message: "User not found", status: "Failed" };
                // responseFunction(meta, dataArray, responsecode.Forbidden, res);
                req.flash('msg', 'User not found');
                res.redirect('/login');
            }
        } catch (error) {
            // let meta: object = { message: "Server error", status: "Failed" };
            // responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
            req.flash('msg', 'Server error');
            res.redirect('/login');
        }
    },

    update: async function update(req: Request, res: Response) {
        if (req.body.password) {
            req.body.password = CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString();
        }
        try {
            const user: any = await User.findById(req.params.id);
            if (user) {
                const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, { new: true });
                let meta: object = { message: "User updated successfully", status: "Success" };
                responseFunction(meta, updatedUser, responsecode.Success, res);
            } else {
                let meta: object = { message: "user not found", status: "Failed" };
                responseFunction(meta, dataArray, responsecode.Not_Found, res);
            }
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    deleteUser: async function deleteUser(req: Request, res: Response) {
        try {
            await User.findByIdAndDelete(req.params.id);
            let meta: object = { message: "User Deleted successfully", status: "Success" };
            responseFunction(meta, dataArray, responsecode.Success, res);
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    getUser: async function getUser(req: Request, res: Response) {
        try {
            const user: any = await User.findById(req.params.id);
            if (user) {
                const { password, ...others } = user._doc;
                let meta: object = { message: "User Fetched successfully", status: "Success" };
                responseFunction(meta, others, responsecode.Success, res);
            } else {
                let meta: object = { message: "user not found", status: "Failed" };
                responseFunction(meta, dataArray, responsecode.Not_Found, res);
            }
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    getAllUser: async function getAllUser(req: Request, res: Response) {
        const query: any = req.query.new;
        try {
            const users: any = query ? await User.find().sort({ _id: -1 }).limit(1) : await User.find();
            if (users) {
                let meta: object = { message: "Users Fetched successfully", status: "Success" };
                responseFunction(meta, users, responsecode.Success, res);
            } else {
                let meta: object = { message: "user not found", status: "Failed" };
                responseFunction(meta, dataArray, responsecode.Not_Found, res);
            }
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    getUserStats: async function getUserStats(req: Request, res: Response) {
        const date: Date = new Date();
        const lastYear: Date = new Date(date.setFullYear(date.getFullYear() - 1));
        try {
            const data: any = await User.aggregate([
                { $match: { createdAt: { $gt: lastYear } } },
                {
                    $project: {
                        month: { $month: "$createdAt" },
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        total: { $sum: 1 },
                    },
                },
            ]);
            let meta: object = { message: "Users Fetched successfully", status: "Success" };
            responseFunction(meta, data, responsecode.Success, res);
        } catch (error) {
            let meta: object = { message: "Server error", status: "Failed" };
            responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        }
    },

    forgotPassword: async function forgotPassword(req: Request, res: Response) {
        let password: string;
        try {
            const decoded = jwt.verify(req.cookies.auth, config.get('jwtSecret'));  
            let user: any = await User.findById(decoded.user_id);
            if (user) {
                const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
                if (isMatch) {
                    if (req.body.newPassword === req.body.confirmPassword) {
                        const salt = await bcrypt.genSalt(10);
                        const hashed = await bcrypt.hash(req.body.newPassword, salt);
                        await User.updateOne({ "_id": decoded.user_id }, { $set: { "password":hashed}});
                        //await mailService(user.email, user.userName, req.body.newPassword);
                        req.flash('msg', 'Password Updated Successfully');
                        res.clearCookie("auth");
                        res.redirect('/login');
                    } else {
                        req.flash('msg', 'your new password and confirm password not match');
                        res.redirect('/updatepassword');
                    }
                } else {
                    req.flash('msg', 'your current password is wrong');
                    res.redirect('/updatepassword');
                }
            } else {
                req.flash('msg', 'user not found');
                res.redirect('/updatepassword');
            }
        } catch (error) {
            req.flash('msg', 'Server error');
            res.redirect('/updatepassword');
        }
    }
}

export default userController;