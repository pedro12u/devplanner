import { Trash2, Edit, GripVertical } from 'lucide-react';
import { Task } from '../services/TaskService';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2 flex-1">
          <GripVertical className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <h4 className="text-sm font-semibold text-gray-800 flex-1">{task.title}</h4>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{task.description}</p>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {new Date(task.created_at).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </div>
  );
}
