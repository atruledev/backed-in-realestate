import express, { Router } from "express"
import AuthController from "../Controllers/auth.controller.js";  
const router = express.Router();


router.post('/login', AuthController.login);
router.post('/post', AuthController.register);
router.post('/register', AuthController.register);


export default router;