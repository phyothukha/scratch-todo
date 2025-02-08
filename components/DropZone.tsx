import React from "react";
import { motion } from "framer-motion";
const DropZone = ({
  beforeId,
  column,
}: {
  beforeId: string | null;
  column: string;
  active?: boolean;
}) => {
  return (
    <motion.div
      layout
      className=" w-full h-[10px] rounded-md "
      data-before={beforeId || "-1"}
      data-column={column}
    >
      {""}
    </motion.div>
  );
};

export default DropZone;
