import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const taskSchema = z.object({
  title: z.string().min(1),
  status: z.string(),
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
