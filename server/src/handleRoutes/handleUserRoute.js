const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { db } = require("../../dbConnection/connection");
const { eq } = require("drizzle-orm");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SALT = process.env.SALT;
const { userTable } = require("../Schemas/schema");

//function to handle user registration
const handleRegister = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  console.log("userName", userName, "email", email, "password", password);
  if (!userName || !email || !password) {
    res.status(401);
    throw new Error("All fields are mandatory");
  }
  const existingEmail = await db
    .select({ email: userTable.email })
    .from(userTable)
    .where(eq(userTable.email, email));

  console.log("the existing Email", existingEmail);
  if (existingEmail.length != 0) {
    res.status(403);
    throw new Error("Email already exists");
  }
  const hashedPassword = bcrypt.hashSync(password, SALT);
  console.log("the hashedPassword", hashedPassword);
  await db.insert(userTable).values({
    userName: userName,
    email: email,
    password: hashedPassword,
  });
  res.status(200).json({
    message: "user was sucessfully registered",
  });
});

//function to handle user login
const handleLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("the login email", email, "the password", password);
  if (!email || !password) {
    res.status(401);
    throw new Error("All fields are mandatory");
  }
  const checkEmail = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));
  if (checkEmail.length == 0) {
    res.status(404);
    throw new Error("email invalid, have you registered?");
  }
  console.log("the checkEmail", checkEmail);
  const isPasswordCorrect = bcrypt.compareSync(
    password,
    checkEmail[0].password
  );
  if (isPasswordCorrect === false) {
    res.status(401);
    throw new Error("password incorrect");
  }
  console.log("check password", isPasswordCorrect);
  const jwtBody = { email: checkEmail[0].email };
  const accessToken = jwt.sign(jwtBody, process.env.COOKIE_TOKEN);
  res.cookie("accessToken", accessToken);
  res.status(200).json({
    message: "User signed in successfully",
    accessToken: accessToken,
    name: checkEmail[0].userName,
    email: checkEmail[0].email,
    status: 200,
  });
});

const authorize = asyncHandler(async (req, res) => {
  const { accessToken } = req.cookies;
  console.log("the cookies", req.cookies);
  if (!accessToken) {
    res.status(401);
    throw new Error("User not authorized");
  }
  let userEmail;
  jwt.verify(accessToken, process.env.COOKIE_TOKEN, (err, data) => {
    if (err) {
      res.status(403);
      throw new Error("data tampered with, not authorized");
    }
    userEmail = data.email;
    console.log("the data is this", data);
    res.status(200).json({
      success: true,
      status: 200,
      email: userEmail,
    });
  });
});
const handleLogout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({
    message: "user logged out successfully",
  });
});

module.exports = { handleRegister, handleLogin, authorize, handleLogout };
