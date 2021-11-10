import { Router, Response } from "express";
import userController from "../controllers/userApiController";
import { ValidateToken, ValidateTokenAndAdmin, ValidateTokenAndAuthorization, authenticate, unauthenticate } from "../middleware/authenticate";
const router: Router = Router();

//server started and api running
router.get('/', unauthenticate, (req, res) => {
    res.render('home.ejs');
});

router.get('/register', authenticate, (req, res) => {
    res.render('user/register.ejs');
});

router.post('/register', authenticate, userController.register);

router.get('/login', authenticate, (req, res) => {
    res.render('user/login.ejs');
});

router.post('/login', authenticate, userController.login);

router.get('/updatepassword',unauthenticate, (req, res) => {
    res.render('user/updatepassword.ejs');
});

router.post('/updatepassword',unauthenticate, userController.forgotPassword);

router.get('/logout', (req, res) => {
    res.clearCookie("auth");
    res.redirect('/login');
});

router.get('/find/:id', ValidateToken, userController.getUser);

router.get('/all', ValidateTokenAndAdmin, userController.getAllUser);

router.put('/update/:id', ValidateTokenAndAuthorization, userController.update);

router.delete('/delete/:id', ValidateTokenAndAdmin, userController.deleteUser);

router.get('/stats', ValidateToken, userController.getUserStats);

export default router;