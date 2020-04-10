import express from "express";

import UserApi from "./user.controller";

const router = express.Router();

router.route("/signup").post(UserApi.signUp);
router.route("/signin").post(UserApi.signIn);

export default router;
