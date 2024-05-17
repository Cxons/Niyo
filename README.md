# Task Management

## Overview

This is a simple task management system with real time socket updates. The API allows users to create, retrieve, update, and delete tasks. This application is built using Express and Socket.io for real time bidirectional communication

## Table of Contents

- [API Endpoints](#api-endpoints)
  - [Register User](#register)
  - [Login User](#login)
  - [Authorize User](#current)
  - [Logout User](#logout)
  - [Create Task](#create-task)
  - [Get All Tasks](#get-all-tasks)
  - [Edit Task Details](#edit-task-details)
  - [Delete Task](#delete-task)
  - [Change Completed Status](#change-completed-status)
- [Data Models](#data-models)
- [Real-time Data Streaming](#real-time-data-streaming)
- [Usage](#usage)


## API Endpoints


### Sign Up
 **Endpoint: `POST /user/register`
**Description: Enables users to sign up or register
**Request Body:**
```json
{
  "userName": "string",
  "email": "string",
  "password": "string"
}
```
**Response: 
```
{
  "message": "string"
}
```


### Login
**Endpoint:** `POST /user/login`
**Description:** Handles user login or sign in 
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response: 
```
{
 "message": "string",
 "accessToken": "string",
 "name": "string",
 "email": "string",
 "status": "requestStatus"
}
```

### Authorize
**Endpoint:** `GET /user/current`
**Description:** Ensures only authenticated get access to protected resources

**Response: 
```
{
 "email": "string",
 "status": "requestStatus",
 "success": "boolean"
}
```

### Logout
**Endpoint:** `GET /user/logout`
**Description:** Handles user logout

**Response: 
```
{
  "message" : "string"
}
```



### Create Task
**Endpoint: `POST /task/createTask`
**Description: Creates a new task.
**Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "creatorEmail" : "string",
  }
   ```
  -**Response:
  ``` json
  {
  "message": "string"
    }
  ```


 ### Get All Tasks
**Endpoint: GET /task/getTask
**Description: Retrieves all tasks.
**Response: 
```json
{
 "message" : "string",
 "data" : "object(array)"
}
```

### Edit Task Details
**Endpoint: PATCH /task/editTaskDetails
**Description: Modifies details like the taskTitle and taskdescription of a task.
**Request Body:**
{
  "taskId": "string",
  "taskTitle": "string",
  "taskDescription": "string",
}
**Response:
```json
{
  "message": "string",
  "data": "object"
}
```


### Delete Task
**Endpoint: DELETE /task/deleteTask
**Description: Deletes a task.
**Request Body:**
{
  "taskId": "string"
}
**Response:
```json
{
  "message": "string"
   "data": "object"
 }
```

### Update Task Completion
**Endpoint: PATCH /task/changeCompletedStatus
**Description: Modifies the state of a task if it is completed or not.
**Request Body:**
{
  "taskId": "string",
 "completionStatus": "boolean",
}
**Response:
```json
{
  "message": "string",
  "data": "object"
}
```






## Data Models

-**Users** 
{
  "userName": "string",
  "password": "string",
  "email": "email"
}



-**Tasks** 
{
  "taskId": "string",
  "taskTitle": "string",
  "taskDescription": "string",
  "creatorEmail" : "string",
  "createdAt": "string (YYYY-MM-DD)",
  "completedStatus": "boolean"
}







## Real-time Data Streaming
Real-time updates for task-related events are streamed using Socket.io. The server emits events whenever a task is created, updated, or deleted, and clients can listen for these events to receive real-time updates.


### Events
  -**All tasks apart from the createTask**
Event Name: response
Payload: 
```json
{
  "data": "object(array)"
}
```

 -**createTask**
 Event Name: response
 Payload: 
 ```json
{
  "message": "string"
}
```





### Usage
Setup: Ensure you have Node.js postgresql and npm installed.
Install Dependencies: Run npm install to install all necessary dependencies.
Create a database on postgresql
Create an env file and store the postgres database connection string , a salt value and a cookie_token value
Start Server: Use npm start to start the Express server.
Socket.io: Connect to the server using Socket.io on the client side to receive real-time updates.




