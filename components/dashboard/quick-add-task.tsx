"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskDialog } from "@/components/dialogs/task-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function QuickAddTask() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleCreateTask = async (data: any) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create task");

      toast.success("Task created successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task");
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
      >
        <Plus className="w-4 h-4" />
        New Task
      </Button>

      <TaskDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleCreateTask}
      />
    </>
  );
}
