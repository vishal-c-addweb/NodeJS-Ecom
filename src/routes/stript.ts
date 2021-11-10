import { Router } from "express";
import stripeController from "../controllers/stripeApiController";
import { ValidateToken } from "../middleware/authenticate";
const router: Router = Router();

router.post('/payment', ValidateToken, stripeController.payment);

export default router;