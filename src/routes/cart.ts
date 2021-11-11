import config from "config";
import { Router } from "express";
import request from "../types/Request";
import Cart,{ICart} from "../models/Cart";
import cartController from "../controllers/cartApiController";
import { ValidateToken, ValidateTokenAndAuthorization, ValidateTokenAndAdmin,unauthenticate } from "../middleware/authenticate";
const jwt = require('jsonwebtoken');
const router: Router = Router();

router.get('/addtocart/:id', unauthenticate, cartController.addToCart);

router.get('/removefromcart/:id', unauthenticate, cartController.removeFromCart);

router.get('/clearcart/:id', unauthenticate, cartController.clearCart);

router.get('/find/:userId', ValidateTokenAndAuthorization, cartController.getCart);

router.get('/all', ValidateTokenAndAdmin, cartController.getAllCart);

router.put('/update/:id', ValidateTokenAndAuthorization, cartController.updateCart);

router.delete('/delete/:id', ValidateTokenAndAuthorization, cartController.deleteCart);

router.get('/cart',unauthenticate, async (req,res) => {
    const decoded = jwt.verify(req.cookies.auth, config.get('jwtSecret'));
    let cart:any = await Cart.find({userId:decoded.user_id});
    res.render('product/cart.ejs',{carts:cart});
});

export default router;