import {Router} from 'express';
import * as authCtrl from "../controllers/auth.controller"

const router = Router();

router.post("/", authCtrl.Login)

router.post("/register", authCtrl.signUp)

router.post("/verifyToken", authCtrl.vToken)

router.post("/getUserToken", authCtrl.getUserToken)

export default router;