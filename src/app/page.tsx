"use client";

import { useState, useEffect } from "react";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load todos from API when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data: (Omit<Todo, "createdAt" | "updatedAt"> & {
          createdAt: string;
          updatedAt: string;
        })[] = await response.json();
        // Convert date strings to Date objects
        const todosWithDates = data.map((todo) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        }));
        setTodos(todosWithDates);
      } else {
        console.error("Failed to fetch todos");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text: string) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const newTodo = await response.json();
        const todoWithDates = {
          ...newTodo,
          createdAt: new Date(newTodo.createdAt),
          updatedAt: new Date(newTodo.updatedAt),
        };
        setTodos([todoWithDates, ...todos]);
      } else {
        console.error("Failed to add todo");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id: string) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) return;

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !todoToUpdate.completed }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        const todoWithDates = {
          ...updatedTodo,
          createdAt: new Date(updatedTodo.createdAt),
          updatedAt: new Date(updatedTodo.updatedAt),
        };
        setTodos(todos.map((todo) => (todo.id === id ? todoWithDates : todo)));
      } else {
        console.error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const editTodo = async (id: string, newText: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newText }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        const todoWithDates = {
          ...updatedTodo,
          createdAt: new Date(updatedTodo.createdAt),
          updatedAt: new Date(updatedTodo.updatedAt),
        };
        setTodos(todos.map((todo) => (todo.id === id ? todoWithDates : todo)));
      } else {
        console.error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Todo List</h1>
          <p className="text-muted-foreground">
            使用 Next.js、TypeScript 和 PostgreSQL 打造的待辦事項管理工具
          </p>
          {totalCount > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              已完成 {completedCount} / {totalCount} 項任務
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>我的待辦事項</CardTitle>
          </CardHeader>
          <CardContent>
            <AddTodoForm onAdd={addTodo} />
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
