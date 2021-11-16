import { Router, Response } from "express";
import Request from "../types/Request";
import config from "config";
import userController from "../controllers/userApiController";
import productController from "../controllers/productApiController";
import { ValidateToken, ValidateTokenAndAdmin, ValidateTokenAndAuthorization, authenticate, unauthenticate } from "../middleware/authenticate";
import Product from "../models/Product";
import User from "../models/User";
const jwt = require('jsonwebtoken');
const path = require("path");
const multer = require('multer');
const router: Router = Router();

const storage = multer.diskStorage({
    destination: 'public/images',
    filename: (req: Request, file: any, done: any) => {
        return done(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
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

router.get('/admin/users', unauthenticate, userController.getAllUser);

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

export default router;