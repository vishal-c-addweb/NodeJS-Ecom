import { Router } from "express";
import stripeController from "../controllers/stripeApiController";
import { ValidateToken,unauthenticate } from "../middleware/authenticate";
const router: Router = Router();
require('dotenv').config();

router.get('/checkout',unauthenticate, (req, res) => {
    res.render('checkout.ejs',{
        key: process.env.PUBLISH_API_KEY
    });
});

router.post('/payment', stripeController.payment);

export default router;