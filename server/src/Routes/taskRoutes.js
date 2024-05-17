const express = require("express");
const taskRouter = express.Router();
const asyncHandler = require("express-async-handler");
const {
  createTask,
  getAllTasks,
  editTaskDetails,
  deleteTasks,
  changeCompletedStatus,
} = require("../handleRoutes/handleTask");

const tasksRouter = function (io) {
  taskRouter.post(
    "/createTask",
    asyncHandler(async (req, res) => {
      await createTask(io, req, res);
    })
  );
  taskRouter.get(
    "/getTask",
    asyncHandler(async (req, res) => {
      await getAllTasks(io, req, res);
    })
  );
  taskRouter.patch(
    "/editTaskDetails",
    asyncHandler(async (req, res) => {
      await editTaskDetails(io, req, res);
    })
  );
  taskRouter.delete(
    "/deleteTask",
    asyncHandler(async (req, res) => {
      await deleteTasks(io, req, res);
    })
  );
  taskRouter.patch(
    "/changeCompletedStatus",
    asyncHandler(async (req, res) => {
      await changeCompletedStatus(io, req, res);
    })
  );
  return taskRouter;
};

module.exports = tasksRouter;
