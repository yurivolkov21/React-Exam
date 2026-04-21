import { CheckCircle2Icon, ListTodoIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import type { FormEvent } from "react";
import { SUBJECT_OPTIONS } from "../constants";
import type { StudyTask, TaskFilter, TaskPriority } from "../types";

type TasksSectionProps = {
  editingTaskId: string | null;
  titleInput: string;
  subjectInput: string;
  priorityInput: TaskPriority;
  dueDateInput: string;
  taskSearch: string;
  taskFilter: TaskFilter;
  visibleTasks: StudyTask[];
  filteredTasks: StudyTask[];
  onTitleInputChange: (value: string) => void;
  onSubjectInputChange: (value: string) => void;
  onPriorityInputChange: (value: TaskPriority) => void;
  onDueDateInputChange: (value: string) => void;
  onTaskSearchChange: (value: string) => void;
  onTaskFilterChange: (value: TaskFilter) => void;
  onSubmitTask: (event: FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
  onStartEditTask: (task: StudyTask) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
};

export function TasksSection({
  editingTaskId,
  titleInput,
  subjectInput,
  priorityInput,
  dueDateInput,
  taskSearch,
  taskFilter,
  visibleTasks,
  filteredTasks,
  onTitleInputChange,
  onSubjectInputChange,
  onPriorityInputChange,
  onDueDateInputChange,
  onTaskSearchChange,
  onTaskFilterChange,
  onSubmitTask,
  onCancelEdit,
  onStartEditTask,
  onToggleTask,
  onDeleteTask,
}: TasksSectionProps) {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingTaskId ? "Edit Task" : "Create New Task"}</CardTitle>
          <CardDescription>
            Create concise study tasks and prioritize deadlines for easier tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={onSubmitTask}>
            <Input
              placeholder="Task title"
              value={titleInput}
              onChange={(event) => onTitleInputChange(event.target.value)}
            />
            <NativeSelect
              value={subjectInput}
              onChange={(event) => onSubjectInputChange(event.target.value)}
            >
              {SUBJECT_OPTIONS.map((subjectOption) => (
                <NativeSelectOption key={subjectOption} value={subjectOption}>
                  {subjectOption}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <NativeSelect
              value={priorityInput}
              onChange={(event) => onPriorityInputChange(event.target.value as TaskPriority)}
            >
              <NativeSelectOption value="low">Low priority</NativeSelectOption>
              <NativeSelectOption value="medium">Medium priority</NativeSelectOption>
              <NativeSelectOption value="high">High priority</NativeSelectOption>
            </NativeSelect>
            <Input
              type="date"
              value={dueDateInput}
              onChange={(event) => onDueDateInputChange(event.target.value)}
            />
            <div className="md:col-span-2 flex flex-wrap gap-2">
              <Button type="submit">
                <PlusIcon />
                {editingTaskId ? "Update Task" : "Add Task"}
              </Button>
              {editingTaskId ? (
                <Button variant="outline" type="button" onClick={onCancelEdit}>
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>Study tasks saved in localStorage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={taskSearch}
              onChange={(event) => onTaskSearchChange(event.target.value)}
              placeholder="Search by title or subject"
              className="sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={taskFilter === "all" ? "default" : "outline"}
                onClick={() => onTaskFilterChange("all")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={taskFilter === "pending" ? "default" : "outline"}
                onClick={() => onTaskFilterChange("pending")}
              >
                Pending
              </Button>
              <Button
                size="sm"
                variant={taskFilter === "done" ? "default" : "outline"}
                onClick={() => onTaskFilterChange("done")}
              >
                Done
              </Button>
            </div>
          </div>

          {filteredTasks.map((task) => (
            <div key={task.id} className="rounded-md border p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {task.subject} {task.dueDate ? `• due ${task.dueDate}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{task.priority}</Badge>
                  <Badge variant={task.completed ? "secondary" : "outline"}>
                    {task.completed ? "Done" : "Pending"}
                  </Badge>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => onStartEditTask(task)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => onToggleTask(task.id)}>
                  <CheckCircle2Icon />
                  {task.completed ? "Mark pending" : "Mark done"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDeleteTask(task.id)}>
                  <Trash2Icon />
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ListTodoIcon />
                </EmptyMedia>
                <EmptyTitle>
                  {visibleTasks.length === 0
                    ? "No tasks yet"
                    : "No tasks match current filter"}
                </EmptyTitle>
                <EmptyDescription>
                  {visibleTasks.length === 0
                    ? "Add your first task to start using Learning Hub Mini."
                    : "Try changing filters or clearing the search keyword to find matching tasks."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
