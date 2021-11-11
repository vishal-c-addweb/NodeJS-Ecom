import { Router, Response } from "express";
import config from "config";
import userController from "../controllers/userApiController";
import { ValidateToken, ValidateTokenAndAdmin, ValidateTokenAndAuthorization, authenticate, unauthenticate } from "../middleware/authenticate";
import Product from "../models/Product";
import User from "../models/User";
const jwt = require('jsonwebtoken');
const router: Router = Router();

router.get('/', unauthenticate, async (req, res) => {
    let products: any = await Product.find();
    res.render('home.ejs', { products: products });
});

router.get('/register', authenticate, (req, res) => {
    res.render('user/register.ejs');
});

router.post('/register', authenticate, userController.register);

router.get('/login', authenticate, (req, res) => {
    res.render('user/login.ejs');
});

router.post('/login', authenticate, userController.login);

router.get('/profile', unauthenticate, async (req, res) => {
    const decoded = jwt.verify(req.cookies.auth, config.get('jwtSecret'));  
    let user: any = await User.findById(decoded.user_id);
    res.render('user/profile.ejs',{user:user});
});

router.get('/updatepassword', unauthenticate, (req, res) => {
    res.render('user/updatepassword.ejs');
});

router.post('/updatepassword', unauthenticate, userController.forgotPassword);

router.get('/logout', (req, res) => {
    res.clearCookie("auth");
    res.redirect('/login');
});

router.get('/find/:id', ValidateToken, userController.getUser);

router.get('/all', ValidateTokenAndAdmin, userController.getAllUser);

router.put('/update/:id', ValidateTokenAndAuthorization, userController.update);

router.delete('/delete/:id', ValidateTokenAndAdmin, userController.deleteUser);

router.get('/stats', ValidateToken, userController.getUserStats);

export default router;