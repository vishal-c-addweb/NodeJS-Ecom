import { Router } from "express";
import productController from "../controllers/productApiController";
import { ValidateToken,ValidateTokenAndAdmin } from "../middleware/authenticate";
const router: Router = Router();

router.post('/add', ValidateTokenAndAdmin, productController.addProduct);

router.put('/update/:id', ValidateTokenAndAdmin, productController.updateProduct);

router.delete('/delete/:id', ValidateTokenAndAdmin, productController.deleteProduct);

router.get('/find/:id',ValidateToken, productController.getProduct);

router.get('/all',ValidateTokenAndAdmin, productController.getAllProduct);

export default router;