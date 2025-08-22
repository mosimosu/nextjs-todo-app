"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddTodoFormProps {
  onAdd: (text: string) => void;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="輸入新的待辦事項..."
          className="flex-1"
        />
        <Button type="submit">新增</Button>
      </div>
    </form>
  );
}
