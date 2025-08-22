import TodoItem from "./TodoItem";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, newText: string) => void;
}

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>目前沒有任何待辦事項</p>
        <p className="text-sm mt-1">新增一個項目開始使用吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          completed={todo.completed}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
