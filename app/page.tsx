"use client";
import { useEffect, useState } from "react";
import Column from "@/components/Column";
import { useTodoStore } from "@/hooks/useTodoStore";
import { fetchTasks } from "@/lib/api";
import AddTaskDialog from "@/components/AddTaskDialoag";
import Icon from "@/public/favicon.png";
import Image from "next/image";

export interface CardProp {
  title: string;
  id: string;
  status: string;
}

export default function Home() {
  const { setCards } = useTodoStore();
  const [isLoading, setIsLoading] = useState(false);

  //===== All Column data fetching =====//
  useEffect(() => {
    setIsLoading(true);
    fetchTasks()
      .then((res) => {
        setIsLoading(false);
        setCards(res);
      })
      .catch((error) => {
        setIsLoading(true);
        console.error(error);
      });
  }, [setCards]);

  return (
    <section className="px-12 mt-4">
      <div className="flex items-center gap-5">
        <h4 className="text-2xl font-bold">
          <Image
            height={50}
            width={50}
            className=" mx-auto object-cover"
            alt=""
            src={Icon}
          />
        </h4>
        <AddTaskDialog />
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 max-h-screen lg:grid-cols-4 gap-5 mt-5">
        <div className=" bg-blue-100 p-5 rounded-lg">
          <Column isLoading={isLoading} column="task" title="TASK" />
        </div>
        <div className=" bg-green-100 p-5 rounded-md">
          <Column isLoading={isLoading} column="todo" title="TODO" />
        </div>
        <div className=" bg-yellow-100 p-5 rounded-lg">
          <Column isLoading={isLoading} column="doing" title="IN PROGRESS" />
        </div>
        <div className=" bg-purple-100 p-5 rounded-lg">
          <Column isLoading={isLoading} column="done" title="Finished" />
        </div>
      </div>
    </section>
  );
}
