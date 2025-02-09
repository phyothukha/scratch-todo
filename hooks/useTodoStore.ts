import { create } from "zustand";
import { CardProp } from "@/app/page";

// Define the store type
interface TodoStore {
  cards: CardProp[];
  setCards: (cards: CardProp[]) => void;
}

// Create the store
export const useTodoStore = create<TodoStore>((set) => ({
  cards: [],
  setCards: (cards) => set({ cards }),
}));
