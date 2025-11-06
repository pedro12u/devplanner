import { BarChart3, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Task } from '../services/TaskService';

interface TaskStatisticsProps {
  tasks: Task[];
  columns: string[];
}

export default function TaskStatistics({ tasks, columns }: TaskStatisticsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === columns[columns.length - 1]).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorityCount = {
    urgente: tasks.filter(t => t.priority === 'urgente').length,
    alta: tasks.filter(t => t.priority === 'alta').length,
    media: tasks.filter(t => t.priority === 'media').length,
    baixa: tasks.filter(t => t.priority === 'baixa').length,
  };

  const tasksByStatus = columns.map(column => ({
    status: column,
    count: tasks.filter(t => t.status === column).length,
    percentage: totalTasks > 0 ? Math.round((tasks.filter(t => t.status === column).length / totalTasks) * 100) : 0,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Estatísticas</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalTasks}</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Concluídas</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progresso Geral</span>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Por Status</h4>
        <div className="space-y-2">
          {tasksByStatus.map(({ status, count, percentage }) => (
            <div key={status}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">{status}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Por Prioridade</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Urgente</span>
            </div>
            <span className="text-sm font-bold text-red-600 dark:text-red-400">{priorityCount.urgente}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-orange-50 dark:bg-orange-900/20">
            <span className="text-sm text-gray-700 dark:text-gray-300">Alta</span>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{priorityCount.alta}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-yellow-50 dark:bg-yellow-900/20">
            <span className="text-sm text-gray-700 dark:text-gray-300">Média</span>
            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{priorityCount.media}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-green-50 dark:bg-green-900/20">
            <span className="text-sm text-gray-700 dark:text-gray-300">Baixa</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">{priorityCount.baixa}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
