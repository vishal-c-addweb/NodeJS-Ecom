import { Router } from "express";
import orderController from "../controllers/orderApiController";
import Order from "../models/Order";
import { Response } from "express";
import Request from "../types/Request";
const moment = require('moment');
import { ValidateToken, ValidateTokenAndAuthorization, ValidateTokenAndAdmin,unauthenticate } from "../middleware/authenticate";
const router: Router = Router();

router.post('/addOrder', unauthenticate, orderController.addOrder);

router.get('/find/:userId', ValidateTokenAndAuthorization, orderController.getOrder);

router.get('/all', ValidateTokenAndAdmin, orderController.getAllOrder);

router.put('/update/:id', ValidateTokenAndAdmin, orderController.updateOrder);

router.delete('/delete/:id', ValidateTokenAndAdmin, orderController.deleteOrder);

router.get('/income', ValidateTokenAndAdmin, orderController.getMonthlyIncome);

router.get('/trackorder/:id',unauthenticate, async (req:Request,res) => {
    let order: any =  await Order.findById(req.params.id);
    res.render('product/trackorder.ejs',{order:order});
});

router.get('/order',unauthenticate, async (req:Request,res) => {
    let orders: any =  await Order.find({userId:req.userId});
    res.render('product/order.ejs',{orders:orders,moment:moment});
});

export default router;