import { DragEvent } from "react";
import CardItem from "./CardItem";
import DropZone from "./DropZone";
import { Badge } from "./ui/badge";
import { CardProp } from "@/app/page";
import { cn } from "@/lib/utils";
import { updateTaskStatus } from "@/lib/api";
import { useTodoStore } from "@/hooks/useTodoStore";
import { Card, CardContent, CardHeader } from "./ui/card";

interface dataProp {
  column: string;
  title: string;
  isLoading: boolean;
}

const Column = ({ column, isLoading, title }: dataProp) => {
  const { cards, setCards } = useTodoStore();
  const filterCard = cards?.filter((c) => c.status === column);

  const getAllIndicators = (): HTMLDivElement[] => {
    return Array.from(document.querySelectorAll(`[data-column=${column}]`));
  };

  //===== Function to get the nearest drop zone =====//
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

  //===== Function to highlight the drop zone =====//
  const dropZoneActive = (e: DragEvent<HTMLDivElement>) => {
    const indicators = getAllIndicators();

    clearHighlights(e, indicators);
    const el = getNearestIndicators(e, indicators);

    el?.element.classList.add("bg-cyan-100");
  };

  //===== Function to clear the drop zone =====//
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

  //===== Function to update the task's status in the database =====//
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
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
      updateTaskStatus(updateCardStatus);
    }
  };

  return (
    <>
      <div className=" pb-2 flex items-center justify-between">
        <Badge className={cn(SelectColor.get(column) || "")}>
          {title}({filterCard.length})
        </Badge>
      </div>

      <div
        className=" h-full space-y-3 "
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <Card
                key={index}
                className="w-full animate-pulse my-10 bg-gray-100 rounded-md"
              >
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
                </CardContent>
              </Card>
            ))
          : filterCard.map((cardItem) => (
              <CardItem
                key={cardItem.id}
                cardItem={cardItem}
                handleDragStart={handleDragStart}
              />
            ))}
        <DropZone beforeId={null} column={column} />
      </div>
    </>
  );
};

export default Column;

const SelectColor = new Map<string, string>([
  ["task", "bg-blue-400"],
  ["todo", "bg-green-400"],
  ["doing", "bg-yellow-400"],
  ["done", "bg-purple-400"],
]);
