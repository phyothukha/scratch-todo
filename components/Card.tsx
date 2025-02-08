import { DragEvent } from "react";
import { motion } from "framer-motion";
import { IconTrash } from "@tabler/icons-react";
import DropZone from "./DropZone";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import Image from "next/image";
import { CardProp } from "@/app/page";

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
          <p className=" top-2 z-20 right-2 absolute">
            <Button
              className=" cursor-pointer size-8 "
              variant="destructive"
              size="icon"
              onClick={() => deleteCard(cardItem.id)}
            >
              <IconTrash className=" cursor-pointer" size={20} />
            </Button>
          </p>
          <CardHeader className="flex pb-0 gap-3">
            <div className="flex flex-col">
              <p
                className={`text-md  font-semibold  ${SelectColor.get(cardItem.status)} `}
              >
                NextUI
              </p>
              <p className="text-[12px] text-default-500">nextui.org</p>
            </div>
          </CardHeader>
          <CardContent className=" text-neutral-500 text-[12px]">
            <p className=" mb-5">{cardItem?.title}</p>
            <Image
              alt="nextui logo"
              width={100}
              height={100}
              className=" object-cover w-full rounded-md"
              src="https://plus.unsplash.com/premium_photo-1717279908053-e0e8618eca45?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"
            />
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
