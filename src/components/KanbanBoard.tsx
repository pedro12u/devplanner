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
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

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

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, column: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      setDragOverColumn(null);
      return;
    }

    try {
      await TaskService.moveTask(draggedTask.id, newStatus);
      onTaskUpdate();
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
      alert('Erro ao mover tarefa. Tente novamente.');
    } finally {
      setDraggedTask(null);
      setDragOverColumn(null);
    }
  };

  const getColumnColor = (column: string) => {
    const isDragOver = dragOverColumn === column;
    switch (column) {
      case 'A Fazer':
        return isDragOver ? 'bg-gray-100 dark:bg-gray-700 border-gray-400 dark:border-gray-500' : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600';
      case 'Fazendo':
        return isDragOver ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600';
      case 'Feito':
        return isDragOver ? 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-500' : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600';
      default:
        return isDragOver ? 'bg-gray-100 dark:bg-gray-700 border-gray-400 dark:border-gray-500' : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600';
    }
  };

  const getColumnHeaderColor = (column: string) => {
    switch (column) {
      case 'A Fazer':
        return 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700';
      case 'Fazendo':
        return 'text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-800';
      case 'Feito':
        return 'text-green-700 dark:text-green-200 bg-green-100 dark:bg-green-800';
      default:
        return 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column, columnIndex) => {
        const columnTasks = getTasksByColumn(column);

        return (
          <div
            key={column}
            className={`rounded-lg border-2 transition-all duration-200 ${getColumnColor(column)} p-4`}
            onDragOver={(e) => handleDragOver(e, column)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column)}
          >
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
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />

                  <div className="flex justify-between mt-2 px-1">
                    <button
                      onClick={() => handleMoveTask(task.id, 'left')}
                      disabled={columnIndex === 0 || movingTaskId === task.id}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span>Anterior</span>
                    </button>

                    <button
                      onClick={() => handleMoveTask(task.id, 'right')}
                      disabled={columnIndex === columns.length - 1 || movingTaskId === task.id}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>Próximo</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {columnTasks.length === 0 && dragOverColumn === column && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Solte aqui</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
