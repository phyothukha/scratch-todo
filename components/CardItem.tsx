import { DragEvent, useState } from "react";
import { motion } from "framer-motion";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import DropZone from "./DropZone";
import { Card, CardContent, CardHeader } from "./ui/card";
import { CardProp } from "@/app/page";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { deleteTask, fetchTasks } from "@/lib/api";
import { useTodoStore } from "@/hooks/useTodoStore";
import { Dialog, DialogTrigger } from "./ui/dialog";
import UpdateTaskDialog from "./UpdateTaskDialog";

interface cardItemProp {
  cardItem: CardProp;
  handleDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
}

const CardItem = ({ cardItem, handleDragStart }: cardItemProp) => {
  const { cards, setCards } = useTodoStore();
  const [open, setopen] = useState(false);

  //===== Function to delete the task's status in the database =====//
  const deleteCard = async (id: string) => {
    const filterCard = cards.filter((card) => card.id !== id);
    setCards(filterCard);
    await deleteTask(id);
    await fetchTasks();
  };
  return (
    <>
      <DropZone beforeId={cardItem.id} column={cardItem.status} />
      <motion.div layout layoutId={cardItem.id}>
        <Card
          className=" relative shadow-lg "
          draggable
          onDragStart={(e) => handleDragStart(e, cardItem.id)}
        >
          <Dialog open={open} onOpenChange={setopen}>
            <DropdownMenu>
              <DropdownMenuTrigger className=" top-2  z-20 right-3 absolute">
                <IconDotsVertical size={13} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Manage Task</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DialogTrigger asChild className=" w-full">
                  <DropdownMenuItem>
                    <IconEdit size={12} className=" stroke-green-400" />
                    <p className=" text-green-400">Edit Task</p>
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuItem onClick={() => deleteCard(cardItem.id)}>
                  <IconTrash size={12} className=" stroke-red-600" />
                  <p className=" text-red-600">Delete Task</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <UpdateTaskDialog setopen={setopen} cardItem={cardItem} />
          </Dialog>
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
