const { db } = require("../../dbConnection/connection");
const { userTable, userTaskTable } = require("../Schemas/schema");
const { eq } = require("drizzle-orm");
const { boolean } = require("drizzle-orm/mysql-core");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//function to create a task
const createTask = async (io, req, res) => {
  const { creatorEmail, taskTitle, taskDescription } = req.body;
  console.log("the console body", creatorEmail, taskTitle, taskDescription);
  if (!creatorEmail || !taskTitle || !taskDescription) {
    res.status(401);
    throw new Error("All fields are mandatory");
  }
  const checkEmail = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, creatorEmail));
  if (checkEmail.length == 0) {
    res.status(401);
    throw new Error("User not permitted");
  }
  console.log("the task checkEmail", checkEmail);
  const createdAt = new Date();
  console.log("createAt", createdAt);
  await db.insert(userTaskTable).values({
    taskTitle: taskTitle,
    taskDescription: taskDescription,
    createdAt: createdAt,
    creatorEmail: creatorEmail,
  });
  io.on("connection", (socket) => {
    socket.emit("response", { message: "the task was created my gee" });
  });
  res.status(200).json({ message: "the task was created my gee" });
};

//function to get all tasks
const getAllTasks = async (io, req, res) => {
  const { accessToken } = req.cookies;
  console.log("the request cookies", req.cookies);
  if (!accessToken) {
    res.status(403);
    throw new Error("Cannot access resource");
  }
  let userEmail;
  jwt.verify(accessToken, process.env.COOKIE_TOKEN, (err, data) => {
    if (err) {
      res.status(403);
      throw new Error("data tampered with");
    }
    userEmail = data.email;
    console.log("the data is this", data);
  });
  const allTasks = await db
    .select()
    .from(userTaskTable)
    .where(eq(userTaskTable.creatorEmail, userEmail));
  io.on("connection", (socket) => {
    socket.emit("response", { data: allTasks });
  });
  res.status(200).json({ message: "These are your tasks", data: allTasks });
  return allTasks;
};

//function to update both title and description of a task
const editTaskDetails = async (io, req, res) => {
  const { taskId, taskDescription, taskTitle } = req.body;
  const getTask = await db
    .select()
    .from(userTaskTable)
    .where(eq(userTaskTable.taskId, taskId));
  console.log("the task is this", getTask);
  if (getTask.length == 0) {
    res.status(403);
    throw new Error("Sorry task was not found");
  }
  let editedData;
  if (taskDescription && !taskTitle) {
    editedData = await db
      .update(userTaskTable)
      .set({
        taskDescription: taskDescription,
      })
      .where(eq(userTaskTable.taskId, taskId))
      .returning({
        updatedDescription: userTaskTable.taskDescription,
      });
  } else if (taskTitle && !taskDescription) {
    editedData = await db
      .update(userTaskTable)
      .set({
        taskTitle: taskTitle,
      })
      .where(eq(userTaskTable.taskId, taskId))
      .returning({
        updatedTitle: userTaskTable.taskTitle,
      });
  } else if (taskDescription && taskTitle) {
    editedData = await db
      .update(userTaskTable)
      .set({
        taskTitle: taskTitle,
        taskDescription: taskDescription,
      })
      .where(eq(userTaskTable.taskId, taskId))
      .returning({
        updatedDescription: userTaskTable.taskDescription,
        updatedTitle: userTaskTable.taskTitle,
      });
  }
  io.on("connection", (socket) => {
    socket.emit("response", { data: editedData });
  });
  res
    .status(200)
    .json({ message: "the patch request was made", data: editedData });
};

//function to delete a task
const deleteTasks = async (io, req, res) => {
  const { taskId } = req.body;
  console.log("the delete task is", taskId);
  if (!taskId) {
    res.status(401);
    throw new Error("Sorry a task id needed");
  }
  const getTask = await db
    .select()
    .from(userTaskTable)
    .where(eq(userTaskTable.taskId, taskId));
  console.log("the task is this", getTask);
  if (getTask.length == 0) {
    res.status(403);
    throw new Error("Sorry task was not found");
  }
  const deletedTask = await db
    .delete(userTaskTable)
    .where(eq(userTaskTable.taskId, taskId));
  io.on("connection", (socket) => {
    socket.emit("response", { data: deletedTask });
  });
  res
    .status(200)
    .json({ message: "the task was successfully deleted", data: deletedTask });
};

//function to update the completion of a task
const changeCompletedStatus = async (io, req, res) => {
  const { taskId, completedStatus } = req.body;
  if (!taskId) {
    res.status(401);
    throw new Error("sorry a task id needed");
  }
  const getTask = await db
    .select()
    .from(userTaskTable)
    .where(eq(userTaskTable.taskId, taskId));
  console.log("the task is this", getTask);
  if (getTask.length == 0) {
    res.status(403);
    throw new Error("Sorry task was not found");
  }
  console.log(typeof completedStatus);
  if (typeof completedStatus != "boolean") {
    res.status(401);
    throw new Error("completed must a boolean value");
  }
  const updatedStatus = await db
    .update(userTaskTable)
    .set({
      completedStatus: completedStatus,
    })
    .where(eq(userTaskTable.taskId, taskId));
  io.on("connection", (socket) => {
    socket.emit("response", { data: updatedStatus });
  });
  res
    .status(200)
    .json({ message: "the task has been completed", data: updatedStatus });
};

module.exports = {
  createTask,
  getAllTasks,
  editTaskDetails,
  deleteTasks,
  changeCompletedStatus,
};
