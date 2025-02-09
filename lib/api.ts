import { CardProp } from "@/app/page";

//=====  Fetch all tasks =====//
export const fetchTasks = async (): Promise<CardProp[]> => {
  try {
    const response = await fetch("/api/todos");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

//=====  Add task =====//
export const addTask = async (payload: {
  title: string;
  status: string;
}): Promise<boolean> => {
  try {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

//=====  Update task status =====//
export const updateTaskStatus = async (card: CardProp): Promise<boolean> => {
  try {
    const response = await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: card.id, status: card.status }),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

//===== Delete task =====//
export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/todos?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};
