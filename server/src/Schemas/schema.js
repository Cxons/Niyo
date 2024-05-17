const { relations } = require("drizzle-orm");
const { time, date } = require("drizzle-orm/mysql-core");
const {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
} = require("drizzle-orm/pg-core");

const userTable = pgTable("user", {
  userName: varchar("userName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

const userTaskTable = pgTable("task", {
  taskId: uuid("taskId").primaryKey().defaultRandom(),
  creatorEmail: varchar("creatorEmail", { length: 255 }),
  taskTitle: varchar("taskTitle", { length: 255 }).notNull(),
  taskDescription: varchar("taskDescription", { length: 10485760 }).notNull(),
  createdAt: varchar("createdAt", { length: 30 }).notNull(),
  completedStatus: boolean("completedStatus").default(false).notNull(),
});
module.exports = { userTable, userTaskTable };
