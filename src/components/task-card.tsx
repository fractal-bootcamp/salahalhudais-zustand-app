import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Task, useStore } from "@/lib/store"

interface TaskCardProps {
  task: Task
  onClick: () => void
  isActive: boolean
}

export function TaskCard({ task, onClick, isActive }: TaskCardProps) {
  const { themes } = useStore()
  const theme = themes.find((t) => t.id === task.themeId) || themes[0]

  return (
    <Card
      className={`cursor-pointer transition-all ${isActive ? "ring-2 ring-primary" : ""}`}
      style={{
        backgroundColor: `${theme.colors.background}20`, // Add transparency
        borderColor: theme.colors.primary,
      }}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium" style={{ color: theme.colors.primary }}>
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-2">{task.description}</p>
      </CardContent>
    </Card>
  )
}

