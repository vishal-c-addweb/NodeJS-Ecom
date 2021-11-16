import { Router } from "express";
import stripeController from "../controllers/stripeApiController";
import { ValidateToken, unauthenticate } from "../middleware/authenticate";
import Request from "../types/Request";
import Product from "../models/Product";
import Cart from "../models/Cart";
const router: Router = Router();
require('dotenv').config();

router.get('/checkout', unauthenticate, async (req: Request, res) => {
    let cart: any = await Cart.findOne({ userId: req.userId });
    let arr = [];
    if (cart) {
        let products: any = cart.products;
        for (let i = 0; i < products.length; i++) {
            let product = await Product.findById(products[i].productId);
            let total = product.price * products[i].quantity;
            let groupProd = {
                id: cart.id,
                productId: product.id,
                title: product.title,
                desc: product.desc,
                img: product.img,
                categories: product.categories,
                size: product.size,
                price: product.price,
                color: product.color,
                instock: product.instock,
                quantity: products[i].quantity,
                total: total,
            }
            arr.push(groupProd);
        }
        res.render('product/checkout.ejs', {
            carts: arr
        });
    } else {
        res.redirect('/cart');
    }
});

router.post('/order', unauthenticate, stripeController.order);

router.get('/payment', unauthenticate, async (req: Request, res) => {
    let cart: any = await Cart.findOne({ userId: req.userId });
    if (cart && cart.length > 0) {
        res.render('product/payment.ejs', {
            key: process.env.PUBLISH_API_KEY
        });
    } else {
        res.redirect('/cart');
    }
});

router.post('/payment', stripeController.payment);

export default router;