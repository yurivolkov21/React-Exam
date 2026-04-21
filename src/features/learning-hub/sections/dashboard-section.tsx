import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { StudyTask } from "../types";

type DashboardSectionProps = {
  taskStats: {
    total: number;
    completed: number;
    pending: number;
    progress: number;
    dueToday: number;
  };
  visibleTasks: StudyTask[];
};

export function DashboardSection({
  taskStats,
  visibleTasks,
}: DashboardSectionProps) {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle>{taskStats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle>{taskStats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Pending</CardDescription>
            <CardTitle>{taskStats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Due Today</CardDescription>
            <CardTitle>{taskStats.dueToday}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>
            {taskStats.completed}/{taskStats.total} tasks completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={taskStats.progress} />
          <p className="text-sm text-muted-foreground">{taskStats.progress}% complete</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>
            Your 5 most recently updated tasks to track study progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleTasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-3 rounded-md border p-3"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.subject}</p>
              </div>
              <Badge variant={task.completed ? "secondary" : "outline"}>
                {task.completed ? "Done" : "Pending"}
              </Badge>
            </div>
          ))}
          {visibleTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tasks yet. Go to the Tasks tab to create one.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
