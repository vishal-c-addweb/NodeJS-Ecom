import { Router } from "express";
import orderController from "../controllers/orderApiController";
import { ValidateToken, ValidateTokenAndAuthorization, ValidateTokenAndAdmin } from "../middleware/authenticate";
const router: Router = Router();

router.post('/add', ValidateToken, orderController.addOrder);

router.get('/find/:userId', ValidateTokenAndAuthorization, orderController.getOrder);

router.get('/all', ValidateTokenAndAdmin, orderController.getAllOrder);

router.put('/update/:id', ValidateTokenAndAdmin, orderController.updateOrder);

router.delete('/delete/:id', ValidateTokenAndAdmin, orderController.deleteOrder);

router.get('/income', ValidateTokenAndAdmin, orderController.getMonthlyIncome);

export default router;