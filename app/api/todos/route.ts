import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1),
  status: z.enum(["task", "doing", "done", "todo"]),
});

//===== Handle GET request - Fetch all tasks =====//
export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

//===== Handle POST request - Create a new task =====//
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = taskSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: validatedData.data,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

//===== Handle PATCH request - Update a task by ID =====//
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

//===== Handle DELETE request - Delete a task by ID =====//
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
