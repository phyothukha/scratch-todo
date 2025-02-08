import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const validation = todoSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const todo = await prisma.todo.create({
    data: validation.data,
  });

  return NextResponse.json(todo, { status: 201 });
}
