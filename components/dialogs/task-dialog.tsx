"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Calendar as CalendarIcon, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubtasksList } from "@/components/subtasks/subtasks-list";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  priority: z.enum(["Low", "Medium", "High"]),
  description: z.string().optional(),
  deadline: z.date().optional(),
  categoryId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Partial<FormData & { id?: string }>;
  onSave: SubmitHandler<FormData>;
}

export function TaskDialog({ open, onClose, task, onSave }: TaskDialogProps) {
  const [subtasks, setSubtasks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || "",
      priority: task?.priority || "Medium",
      description: task?.description || "",
      deadline: task?.deadline || undefined,
      categoryId: task?.categoryId || undefined,
    },
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (task) {
        reset({
          title: task.title || "",
          priority: task.priority || "Medium",
          description: task.description || "",
          deadline: task.deadline || undefined,
          categoryId: task.categoryId || undefined,
        });

        if (task.id) {
          fetchSubtasks(task.id);
        }
      } else {
        reset({
          title: "",
          priority: "Medium",
          description: "",
          deadline: undefined,
          categoryId: undefined,
        });
      }
    } else {
      setSubtasks([]);
    }
  }, [open, task, reset]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchSubtasks = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks`);
      if (res.ok) {
        const data = await res.json();
        setSubtasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch subtasks:", error);
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto glass">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {task?.id ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription>
            {task?.id
              ? "Update your task details below."
              : "Add a new task to your list. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter task title"
              {...register("title")}
              className={cn(errors.title && "border-red-500")}
            />
            {errors.title && (
              <p className="text-red-600 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="priority" className="w-full">
                      <SelectValue placeholder="Select priority">
                        {field.value}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Low
                        </span>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500" />
                          Medium
                        </span>
                      </SelectItem>
                      <SelectItem value="High">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          High
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || "none"}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <span className="flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full", {
                              "bg-blue-500": category.color === "blue",
                              "bg-red-500": category.color === "red",
                              "bg-green-500": category.color === "green",
                              "bg-yellow-500": category.color === "yellow",
                              "bg-purple-500": category.color === "purple",
                              "bg-gray-500": category.color === "gray",
                            })} />
                            {category.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add task description (optional)"
              {...register("description")}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Deadline</Label>
            <Controller
              control={control}
              name="deadline"
              render={({ field }) => {
                const [open, setOpen] = React.useState(false);

                return (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date (optional)</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date: Date | undefined) => {
                          field.onChange(date);
                          setOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          </div>

          {/* Subtasks (only show when editing existing task) */}
          {task?.id && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subtasks</Label>
              <SubtasksList
                taskId={task.id}
                subtasks={subtasks}
                onUpdate={() => task.id && fetchSubtasks(task.id)}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {task?.id ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
