-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('done', 'task', 'doing', 'todo');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'task',

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
