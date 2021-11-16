import { Router } from "express";
import orderController from "../controllers/orderApiController";
import Order from "../models/Order";
import Request from "../types/Request";
import { ValidateToken, ValidateTokenAndAuthorization, ValidateTokenAndAdmin,unauthenticate } from "../middleware/authenticate";
const router: Router = Router();

router.post('/addOrder', unauthenticate, orderController.addOrder);

router.get('/find/:userId', ValidateTokenAndAuthorization, orderController.getOrder);

router.get('/all', ValidateTokenAndAdmin, orderController.getAllOrder);

router.put('/update/:id', ValidateTokenAndAdmin, orderController.updateOrder);

router.delete('/delete/:id', ValidateTokenAndAdmin, orderController.deleteOrder);

router.get('/income', ValidateTokenAndAdmin, orderController.getMonthlyIncome);

router.get('/order',unauthenticate, async (req:Request,res) => {
    let orders: any =  await Order.find({userId:req.userId})
    res.render('product/order.ejs',{orders:orders});
});

export default router;