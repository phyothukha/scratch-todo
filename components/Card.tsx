import { DragEvent } from "react";
import { motion } from "framer-motion";
import { IconTrash } from "@tabler/icons-react";
import DropZone from "./DropZone";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { CardProp } from "@/app/page";
import UpdateTaskDialog from "./UpdateTaskDialog";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface cardItemProp {
  cardItem: CardProp;
  handleDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  deleteCard: (id: string) => void;
}

const CardItem = ({ cardItem, handleDragStart, deleteCard }: cardItemProp) => {
  return (
    <>
      <DropZone beforeId={cardItem.id} column={cardItem.status} />
      <motion.div layout layoutId={cardItem.id}>
        <Card
          className=" relative"
          draggable
          onDragStart={(e) => handleDragStart(e, cardItem.id)}
        >
          <div className=" top-2 z-20 sright-2 flex gap-2 items-center absolute right-2">
            <UpdateTaskDialog cardItem={cardItem} />
            <Button
              className=" cursor-pointer size-8"
              variant="destructive"
              size="icon"
              onClick={() => deleteCard(cardItem.id)}
            >
              <IconTrash className=" cursor-pointer" size={20} />
            </Button>
          </div>
          <CardHeader className="flex pb-0 gap-3">
            <h3>{cardItem.title.substring(0, 20)}...</h3>
          </CardHeader>
          <CardContent className=" text-neutral-500 text-[12px] my-3">
            <div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[12px] text-default-500",
                  SelectColor.get(cardItem.status),
                )}
              >
                {SelectText.get(cardItem.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default CardItem;

const SelectColor = new Map([
  ["task", "text-blue-500"],
  ["todo", "text-green-500"],
  ["doing", "text-yellow-500"],
  ["done", "text-purple-500"],
]);

const SelectText = new Map([
  ["task", "Task"],
  ["todo", "Todo"],
  ["doing", "In Progress"],
  ["done", "Finish"],
]);
