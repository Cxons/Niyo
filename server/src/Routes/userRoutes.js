const express = require("express");
const userRouter = express.Router();

const {
  handleRegister,
  handleLogin,
  authorize,
  handleLogout,
} = require("../handleRoutes/handleUserRoute");

userRouter.post("/register", handleRegister);
userRouter.post("/login", handleLogin);
userRouter.get("/current", authorize);
userRouter.get("/logout", handleLogout);

module.exports = userRouter;
