import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("/api/tasks");
    setTasks(res.data);
  };

  const createTask = async () => {
    if (!title.trim()) return alert("Task title cannot be empty");
    const res = await axios.post("/api/tasks", {
      title,
      description,
    });
    setTasks([res.data, ...tasks]);
    setTitle("");
    setDescription("");
  };

  const toggleComplete = async (task: Task) => {
    const updated = await axios.put(`/api/tasks/${task.id}`, {
      title: task.title,
      description: task.description,
      completed: !task.completed,
    });
    setTasks(tasks.map((t) => (t.id === task.id ? updated.data : t)));
  };

  const deleteTask = async (id: string) => {
    await axios.delete(`/api/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEdit = (task: Task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const cancelEdit = () => {
    setEditTaskId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = async () => {
    if (!editTaskId) return;
    if (!editTitle.trim()) return alert("Task title cannot be empty");
    const updated = await axios.put(`/api/tasks/${editTaskId}`, {
      title: editTitle,
      description: editDescription,
      completed: tasks.find((t) => t.id === editTaskId)?.completed ?? false,
    });
    setTasks(tasks.map((t) => (t.id === editTaskId ? updated.data : t)));
    cancelEdit();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Tasks</h1>

      <div className="flex flex-col md:flex-row gap-2">
        <Input
          aria-label="Task title"
          placeholder="Task title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
        <Input
          aria-label="Task description"
          placeholder="Description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(e.target.value)
          }
        />
        <Button onClick={createTask}>Add Task</Button>
      </div>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 dark:border-gray-700 rounded-md p-3"
          >
            <div className="flex items-center space-x-2">
              <input
                id={`complete-${task.id}`}
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
                className="w-5 h-5 cursor-pointer"
                aria-label={`Mark task ${task.title} as ${
                  task.completed ? "incomplete" : "complete"
                }`}
              />

              {editTaskId === task.id ? (
                <div className="flex flex-col space-y-2">
                  <Input
                    aria-label="Edit task title"
                    value={editTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditTitle(e.target.value)
                    }
                    className="w-full"
                  />
                  <Input
                    aria-label="Edit task description"
                    value={editDescription}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditDescription(e.target.value)
                    }
                    className="w-full"
                  />
                </div>
              ) : (
                <label
                  htmlFor={`complete-${task.id}`}
                  className={`cursor-pointer ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  <div className="font-semibold">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {task.description}
                    </div>
                  )}
                </label>
              )}
            </div>

            <div className="mt-4 md:mt-0 flex gap-2">
              {editTaskId === task.id ? (
                <>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={saveEdit}
                    aria-label="Save task edit"
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={cancelEdit}
                    aria-label="Cancel task edit"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(task)}
                    aria-label={`Edit task ${task.title}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete task ${task.title}`}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
