import config from "config";
import { Router } from "express";
import Request from "../types/Request";
import Cart,{ICart} from "../models/Cart";
import Product from "../models/Product";
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

router.get('/cart',unauthenticate, async (req:Request,res) => {
    let cart:any = await Cart.findOne({userId:req.userId});
    let arr = [];
    if (cart) {
        let products: any = cart.products;
        for (let i = 0; i < products.length; i++) {
            let product = await Product.findById(products[i].productId);
            let total = product.price * products[i].quantity;
            let groupProd = { 
                id: cart.id,
                productId:product.id,
                title: product.title,
                desc: product.desc,
                img: product.img,
                categories: product.categories,
                size: product.size,
                price: product.price,
                color: product.color,
                instock: product.instock,
                quantity:products[i].quantity,
                total: total,
            }
            arr.push(groupProd);
        }
    }
    res.render('product/cart.ejs',{carts:arr});
});

export default router;