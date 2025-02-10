import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  setOpen,
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className=" bg-cyan-50">
        <AlertDialogHeader>
          <AlertDialogTitle className=" font-nato font-bold ">
            Are U sure you want to delete this task
          </AlertDialogTitle>
          <AlertDialogDescription className=" font-nato text-xs">
            This action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className=" bg-red-500 hover:bg-red-600"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin mr-2" size={16} />}
            {loading ? "Deleting..." : "Delete Task"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
