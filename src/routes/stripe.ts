import { Router } from "express";
import stripeController from "../controllers/stripeApiController";
import { ValidateToken, unauthenticate } from "../middleware/authenticate";
import Request from "../types/Request";
import Product from "../models/Product";
import Cart from "../models/Cart";
const router: Router = Router();
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

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
    if (cart) {
        res.render('product/payment.ejs', {
            key: process.env.PUBLISH_API_KEY
        });
    } else {
        res.redirect("/");
    }
});

router.post('/payment/stripe', async (req:Request,res) => {
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Gourav Hammad',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    })
    .then((customer: any) => {
        return stripe.charges.create({
            amount: req.body.amount,     // Charing Rs 25
            description: 'New Creation Shoes',
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge: any) => {
        // let meta: object = { message: "Success", status: "Success" };
        // responseFunction(meta, charge, responsecode.Success, res);
        res.redirect('/');
    })
    .catch((err: any) => {
        console.log(err);    
        // let meta: object = { message: "Server error", status: "Failed" };
        // responseFunction(meta, dataArray, responsecode.Internal_Server_Error, res);
        res.redirect('back');
    });
});

export default router;