import config from "config";
import { Router } from "express";
import Request from "../types/Request";
import Wishlist from "../models/Wishlist";
import Product from "../models/Product"
import productController from "../controllers/productApiController";
import { ValidateToken,ValidateTokenAndAdmin,unauthenticate } from "../middleware/authenticate";
const jwt = require('jsonwebtoken');
const router: Router = Router();

router.post('/add', ValidateTokenAndAdmin, productController.addProduct);

router.put('/update/:id', ValidateTokenAndAdmin, productController.updateProduct);

router.delete('/delete/:id', ValidateTokenAndAdmin, productController.deleteProduct);

router.get('/find/:id',ValidateToken, productController.getProduct);

router.get('/all',ValidateTokenAndAdmin, productController.getAllProduct);

router.get('/wishlist',unauthenticate, async (req:Request,res) => {
    let wishlist: any = await Wishlist.findOne({ userId:req.userId });
    let arr = [];
    if (wishlist) {
        let products: any = wishlist.products;
        for (let i = 0; i < products.length; i++) {
            let product = await Product.findById(products[i].productId);
            let groupProd = { 
                id: wishlist.id,
                productId:product.id,
                title: product.title,
                desc: product.desc,
                img: product.img,
                categories: product.categories,
                size: product.size,
                price: product.price,
                color: product.color,
                instock: product.instock
            }
            arr.push(groupProd);
        }
    }
    res.render('product/wishlist.ejs',{wishlists:arr});
});

router.get('/addtowishlist/:id',unauthenticate,productController.addToWishlist);

router.get('/wishlist/delete/:id',unauthenticate,productController.deleteFromWishlist);

router.get('/product/details/:id',unauthenticate,async (req,res) => {
    let product: any = await Product.findById(req.params.id);
    res.render('product/details.ejs',{product:product});
});

export default router;