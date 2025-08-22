"use client";

import { useState, useEffect } from "react";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage when component mounts
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsedTodos: (Omit<Todo, "createdAt"> & { createdAt: string })[] =
        JSON.parse(savedTodos);
      // Convert createdAt string back to Date objects
      const todosWithDates = parsedTodos.map((todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
      setTodos(todosWithDates);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Todo List 應用
          </h1>
          <p className="text-gray-600">
            使用 Next.js 和 TypeScript 打造的待辦事項管理工具
          </p>
          {totalCount > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              已完成 {completedCount} / {totalCount} 項任務
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <AddTodoForm onAdd={addTodo} />
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
      </div>
    </div>
  );
}
