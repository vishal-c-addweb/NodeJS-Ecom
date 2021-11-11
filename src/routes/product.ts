import config from "config";
import { Router } from "express";
import Wishlist from "../models/Wishlist";
import productController from "../controllers/productApiController";
import { ValidateToken,ValidateTokenAndAdmin,unauthenticate } from "../middleware/authenticate";
const jwt = require('jsonwebtoken');
const router: Router = Router();

router.post('/add', ValidateTokenAndAdmin, productController.addProduct);

router.put('/update/:id', ValidateTokenAndAdmin, productController.updateProduct);

router.delete('/delete/:id', ValidateTokenAndAdmin, productController.deleteProduct);

router.get('/find/:id',ValidateToken, productController.getProduct);

router.get('/all',ValidateTokenAndAdmin, productController.getAllProduct);

router.get('/wishlist',unauthenticate, async (req,res) => {
    const decoded = jwt.verify(req.cookies.auth, config.get('jwtSecret'));
    let wishlist:any = await Wishlist.find({userId:decoded.user_id});
    res.render('product/wishlist.ejs',{wishlists:wishlist});
});

router.get('/addtowishlist/:id',unauthenticate,productController.addToWishlist);

router.get('/wishlist/delete/:id',unauthenticate,productController.deleteFromWishlist);

export default router;