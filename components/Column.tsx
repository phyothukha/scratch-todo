import { Dispatch, DragEvent, SetStateAction } from "react";
import CardItem from "./Card";
import DropZone from "./DropZone";

import { Badge } from "./ui/badge";
import { CardProp } from "@/app/page";
import { cn } from "@/lib/utils";

interface dataProp {
  column: string;
  cards: CardProp[];
  setCards: Dispatch<SetStateAction<CardProp[]>>;
  title: string;
}

const Column = ({ column, cards, setCards, title }: dataProp) => {
  const filterCard = cards?.filter((c) => c.status === column);

  //===== All DropZone Indicators =====//
  const getAllIndicators = (): HTMLDivElement[] => {
    return Array.from(document.querySelectorAll(`[data-column=${column}]`));
  };

  const getNearestIndicators = (
    e: DragEvent<HTMLDivElement>,
    indicators: HTMLDivElement[],
  ) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      },
    );

    return el;
  };

  const dropZoneActive = (e: DragEvent<HTMLDivElement>) => {
    const indicators = getAllIndicators();

    clearHighlights(e, indicators);
    const el = getNearestIndicators(e, indicators);

    el?.element.classList.add("bg-cyan-100");
  };

  const clearHighlights = (
    e: DragEvent<HTMLDivElement>,
    els?: HTMLDivElement[],
  ) => {
    const indicators = els || getAllIndicators();

    indicators.forEach((indicator) => {
      indicator.classList.remove("bg-cyan-100");
    });

    const el = getNearestIndicators(e, indicators);

    if (el && el.element) {
      el.element.classList.remove("bg-cyan-100");
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("cardId", id);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropZoneActive(e);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    clearHighlights(e);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    const indicators = getAllIndicators();
    const el = getNearestIndicators(e, indicators);

    clearHighlights(e);
    const beforeId = el.element.dataset.before;

    if (beforeId !== cardId) {
      const findCard = cards.find((c) => c.id === cardId);

      if (!findCard) return;
      const updateCardStatus: CardProp = { ...findCard, status: column };

      if (!updateCardStatus) return;

      const newCard = cards?.filter((c) => c.id !== updateCardStatus.id);

      const equalBeforeID = beforeId === "-1";

      if (equalBeforeID) {
        newCard.push(updateCardStatus || []);
      } else {
        const insertIndex = newCard.findIndex((c) => c.id === beforeId);

        newCard.splice(insertIndex, 0, updateCardStatus);
      }

      setCards(newCard);
    }
  };

  //===== Delete Card =====//

  const deleteCard = (id: string) => {
    return setCards((pre) => pre?.filter((card) => card.id !== id));
  };

  return (
    <div className="">
      <div className=" border-b-2 pb-2 flex items-center justify-between">
        <h5 className=" text-neutral-700 text-left font-bold">{title}</h5>
        <Badge className={cn(SelectColor.get(column) || "")}>
          {filterCard.length}
        </Badge>
      </div>
      <div
        className=" h-full  pt-5 space-y-3"
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {filterCard.map((cardItem) => (
          <CardItem
            key={cardItem.id}
            cardItem={cardItem}
            deleteCard={deleteCard}
            handleDragStart={handleDragStart}
          />
        ))}
        <DropZone beforeId={null} column={column} />
      </div>
    </div>
  );
};

export default Column;

const SelectColor = new Map<string, string>([
  ["task", "bg-blue-400"],
  ["todo", "bg-green-400"],
  ["doing", "bg-yellow-400"],
  ["done", "bg-purple-400"],
]);
