"use client";
import { useState } from "react";
import Column from "@/components/Column";
import { data } from "@/data";

export interface CardProp {
  title: string;
  id: string;
  status: string;
}

export default function Home() {
  const [cards, setCards] = useState<CardProp[]>(data);

  return (
    <section className=" px-12 mt-4">
      <div className=" flex items-center justify-between">
        <h4 className=" text-2xl font-bold">Drag&Drop</h4>
      </div>
      <div className=" grid md:grid-cols-2 grid-cols-1 max-h-screen  lg:grid-cols-4 gap-5 mt-5">
        <Column cards={cards} column="task" setCards={setCards} title="TASK" />

        <Column cards={cards} column="todo" setCards={setCards} title="TODO" />

        <Column
          cards={cards}
          column="doing"
          setCards={setCards}
          title="IN PROGRESS"
        />
        <Column
          cards={cards}
          column="done"
          setCards={setCards}
          title="Finished"
        />
      </div>
    </section>
  );
}
