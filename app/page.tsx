"use client";
import { useEffect } from "react";
import Column from "@/components/Column";
import TodoForm from "@/components/AddTaskDialoag";
import { useTodoStore } from "@/hooks/useTodoStore";
import { fetchTasks } from "@/lib/api";

export interface CardProp {
  title: string;
  id: string;
  status: string;
}

export default function Home() {
  const { setCards } = useTodoStore();

  //===== All Column data fetching =====//
  useEffect(() => {
    fetchTasks().then((res) => setCards(res));
  }, [setCards]);

  return (
    <section className="px-12 mt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-bold">Drag&Drop</h4>
        <TodoForm />
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 max-h-screen lg:grid-cols-4 gap-5 mt-5">
        <Column column="task" title="TASK" />
        <Column column="todo" title="TODO" />
        <Column column="doing" title="IN PROGRESS" />
        <Column column="done" title="Finished" />
      </div>
    </section>
  );
}
