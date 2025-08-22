import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, newText: string) => void;
}

export default function TodoItem({
  id,
  text,
  completed,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleEdit = () => {
    if (onEdit && editText.trim() && editText !== text) {
      onEdit(id, editText.trim());
    }
    setIsDialogOpen(false);
  };

  return (
    <Card className="mb-2">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3 flex-1">
          <Checkbox checked={completed} onCheckedChange={() => onToggle(id)} />
          <span
            className={`${
              completed
                ? "line-through text-muted-foreground"
                : "text-foreground"
            } text-sm flex-1`}
          >
            {text}
          </span>
        </div>

        <div className="flex space-x-2">
          {onEdit && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  編輯
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>編輯待辦事項</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="輸入新的內容..."
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      取消
                    </Button>
                    <Button onClick={handleEdit}>確認</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
            刪除
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
