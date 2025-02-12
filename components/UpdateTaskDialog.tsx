"use client";

import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { CardProp } from "@/app/page";
import { fetchTasks, updateTaskStatus } from "@/lib/api";
import { useTodoStore } from "@/hooks/useTodoStore";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.string().min(1, "Status is required"),
});

interface UpdateTaskDialogProps {
  cardItem: CardProp;
  setopen: Dispatch<SetStateAction<boolean>>;
}

const UpdateTaskDialog: FC<UpdateTaskDialogProps> = ({ cardItem, setopen }) => {
  const [loading, setLoading] = useState(false);
  const { setCards } = useTodoStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: cardItem.title,
      status: cardItem.status,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    const success = await updateTaskStatus({ id: cardItem.id, ...data });

    setLoading(false);

    if (success) {
      form.reset();
      toast({ description: "Task updated successfully!" });
      fetchTasks().then((res) => setCards(res));
      setopen(false);
    } else {
      toast({ description: "Failed to add task!", variant: "destructive" });
    }
  };

  return (
    <DialogContent className=" bg-cyan-50">
      <DialogHeader>
        <DialogTitle>Update task</DialogTitle>
        <DialogDescription>
          Enter task details and click submit.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    className=" h-12 rounded-md focus-visible:ring-0 "
                    placeholder="Enter title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className=" h-12  rounded-md focus-visible:ring-0">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="doing">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className=" flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className=" bg-green-500 hover:bg-green-600"
            >
              {loading && <Loader2 className="animate-spin mr-2" size={16} />}
              {loading ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpdateTaskDialog;
