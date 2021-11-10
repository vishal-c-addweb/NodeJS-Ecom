import { Router } from "express";
import cartController from "../controllers/cartApiController";
import { ValidateToken, ValidateTokenAndAuthorization, ValidateTokenAndAdmin } from "../middleware/authenticate";
const router: Router = Router();

router.post('/add', ValidateToken, cartController.addToCart);

router.get('/find/:userId', ValidateTokenAndAuthorization, cartController.getCart);

router.get('/all', ValidateTokenAndAdmin, cartController.getAllCart);

router.put('/update/:id', ValidateTokenAndAuthorization, cartController.updateCart);

router.delete('/delete/:id', ValidateTokenAndAuthorization, cartController.deleteCart);

export default router;