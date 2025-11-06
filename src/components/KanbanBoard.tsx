import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, TaskService } from '../services/TaskService';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  columns: string[];
  onTaskUpdate: () => void;
  onEditTask: (task: Task) => void;
}

export default function KanbanBoard({ tasks, columns, onTaskUpdate, onEditTask }: KanbanBoardProps) {
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);

  const getTasksByColumn = (column: string) => {
    return tasks.filter(task => task.status === column);
  };

  const handleMoveTask = async (taskId: string, direction: 'left' | 'right') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentIndex = columns.indexOf(task.status);
    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= columns.length) return;

    const newStatus = columns[newIndex];

    setMovingTaskId(taskId);
    try {
      await TaskService.moveTask(taskId, newStatus);
      onTaskUpdate();
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
      alert('Erro ao mover tarefa. Tente novamente.');
    } finally {
      setMovingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Deseja realmente excluir esta tarefa?')) return;

    try {
      await TaskService.deleteTask(taskId);
      onTaskUpdate();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      alert('Erro ao excluir tarefa. Tente novamente.');
    }
  };

  const getColumnColor = (column: string) => {
    switch (column) {
      case 'A Fazer':
        return 'bg-gray-50 border-gray-300';
      case 'Fazendo':
        return 'bg-blue-50 border-blue-300';
      case 'Feito':
        return 'bg-green-50 border-green-300';
      default:
        return 'bg-gray-50 border-gray-300';
    }
  };

  const getColumnHeaderColor = (column: string) => {
    switch (column) {
      case 'A Fazer':
        return 'text-gray-700 bg-gray-100';
      case 'Fazendo':
        return 'text-blue-700 bg-blue-100';
      case 'Feito':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column, columnIndex) => {
        const columnTasks = getTasksByColumn(column);

        return (
          <div key={column} className={`rounded-lg border-2 ${getColumnColor(column)} p-4`}>
            <div className={`${getColumnHeaderColor(column)} rounded-lg px-4 py-3 mb-4`}>
              <h3 className="font-bold text-lg">{column}</h3>
              <span className="text-sm opacity-75">{columnTasks.length} tarefa(s)</span>
            </div>

            <div className="space-y-3 min-h-[400px]">
              {columnTasks.map(task => (
                <div key={task.id} className="relative">
                  <TaskCard
                    task={task}
                    onDelete={handleDeleteTask}
                    onEdit={onEditTask}
                  />

                  <div className="flex justify-between mt-2 px-1">
                    <button
                      onClick={() => handleMoveTask(task.id, 'left')}
                      disabled={columnIndex === 0 || movingTaskId === task.id}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span>Anterior</span>
                    </button>

                    <button
                      onClick={() => handleMoveTask(task.id, 'right')}
                      disabled={columnIndex === columns.length - 1 || movingTaskId === task.id}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>Próximo</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
