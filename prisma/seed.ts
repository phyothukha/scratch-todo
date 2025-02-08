import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const data = [
  { title: "Look into render bug in dashboard", id: "1", status: "task" },
  { title: "SOX compliance checklist", id: "2", status: "task" },
  { title: "[SPIKE] Migrate to Azure", id: "3", status: "task" },
  { title: "Document Notifications service", id: "4", status: "task" },
  {
    title: "Research DB options for new microservice",
    id: "5",
    status: "todo",
  },
  { title: "Postmortem for outage", id: "6", status: "todo" },
  { title: "Sync with product on Q3 roadmap", id: "7", status: "todo" },
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    status: "doing",
  },
  { title: "Add logging to daily CRON", id: "9", status: "doing" },
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    status: "done",
  },
];

async function main() {
  console.log("Seeding database...");

  for (const task of data) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: {},
      create: {
        id: task.id,
        title: task.title,
        status: task.status as "task" | "doing" | "done" | "todo", // Ensure it matches the enum type
      },
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
