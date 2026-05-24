import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getUserAddresses,
  saveUserAddress,
  getPrimaryAddress,
} from "./address.controller";

const addressRoute = Router();

// Semua rute address harus melalui autentikasi
addressRoute.use(verifyToken);

addressRoute.get("/", getUserAddresses);
addressRoute.get("/primary", getPrimaryAddress);
addressRoute.post("/", saveUserAddress);

export default addressRoute;
