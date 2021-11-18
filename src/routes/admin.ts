import { Router, Response } from "express";
import Request from "../types/Request";
import config from "config";
import userController from "../controllers/userApiController";
import productController from "../controllers/productApiController";
import { ValidateToken, ValidateTokenAndAdmin, ValidateTokenAndAuthorization, authenticate, unauthenticate } from "../middleware/authenticate";
import Product from "../models/Product";
import Order from "../models/Order";
import User from "../models/User";
const jwt = require('jsonwebtoken');
const path = require("path");
const multer = require('multer');
const moment = require('moment');
const router: Router = Router();

const storage = multer.diskStorage({
    destination: 'public/images',
    filename: (req: Request, file: any, done: any) => {
        console.log(file);
        return done(null, `${file.originalname}`)
    }
})

const upload = multer({
    storage: storage,
});

router.get('/admin', unauthenticate, async (req: Request, res) => {
    if (req.isAdmin) {
        res.render('admin/admin.ejs');
    } else {
        res.redirect('/');
    }
});

/* users routes */

router.get('/admin/users', unauthenticate, userController.getAllUser);

router.get('/admin/users/delete/:id', unauthenticate, userController.deleteUser);

/* products routes */

router.get('/admin/products', unauthenticate, productController.getAllProduct);

router.get('/admin/products/add', unauthenticate, (req, res) => {
    res.render('admin/addproducts.ejs');
});

router.post('/admin/products/add', unauthenticate, upload.single('img'), productController.addProduct);

router.get('/admin/products/delete/:id', unauthenticate, productController.deleteProduct);

router.get('/admin/products/update/:id', unauthenticate, async (req: Request, res) => {
    if (req.isAdmin) {
        let product: any = await Product.findById(req.params.id);
        res.render('admin/editproducts.ejs',{product:product});
    } else {
        res.redirect('/');
    }
});

router.post('/admin/products/update/:id', unauthenticate, upload.single('img'),productController.updateProduct);

/* orders routes */

router.get('/admin/orders', unauthenticate, async(req: Request,res) => {
    let orders: any =  await Order.find();
    res.render('admin/order.ejs',{orders:orders,moment:moment});
});

// router.post('/updateorderstatus/:id/:status',unauthenticate, async (req:Request,res: Response) => {
//     try {
//         await Order.updateOne(
//             { _id: req.params.id},
//             { $set: { status: req.params.status } }
//         );
//         const eventEmitter = req.app.get("eventEmitter");
//         eventEmitter.emit('orderUpdated',{id: req.params.id,status:req.params.status});
//         let orders: any =  await Order.find();
//         res.render('admin/order.ejs',{orders:orders,moment:moment});
//     } catch (error) {
//         console.log(error);
//         res.redirect("back");
//     }
// });

router.post('/admin/order/updatestatus',unauthenticate, async (req:Request,res: Response) => {
    try {
        await Order.updateOne(
            { _id: req.body.orderId},
            { $set: { status: req.body.status } }
        );
        const eventEmitter = req.app.get("eventEmitter");
        eventEmitter.emit('orderUpdated',{id: req.body.orderId,status:req.body.status});
       
        res.redirect("back");
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
});

export default router;