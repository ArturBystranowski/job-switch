export interface TaskBranchProps {
  taskId: number;
  title: string;
  isCompleted: boolean;
  onClick: () => void;
}
