import { Router } from "express";
import {
  createAccount,
  getUser,
  getUserPoints,
  loginAccount,
  logoutAccount,
  getQoinTransactions,
} from "./auth.controller";
import { validate } from "../../middleware/validate";
import { signInSchema, signUpSchema } from "./auth.schema";
import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

router.get("/user", verifyToken, getUser);
router.get("/user/points", verifyToken, getUserPoints);
router.get("/user/qoin-transactions", verifyToken, getQoinTransactions);

router.post("/signup", validate(signUpSchema, "body"), createAccount);
router.post("/signin", validate(signInSchema, "body"), loginAccount);
router.post("/logout", verifyToken, logoutAccount);

export default router;
