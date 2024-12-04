import express from "express";
import {
  register,
  login,
  getUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/get/:id", getUser);

export default router;
