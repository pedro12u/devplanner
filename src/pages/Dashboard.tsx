import { useState, useEffect } from 'react';
import { Plus, FolderOpen, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProjectService, Project } from '../services/ProjectService';
import { TaskService, Task } from '../services/TaskService';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';
import ModalCreateProject from '../components/ModalCreateProject';
import ModalCreateTask from '../components/ModalCreateTask';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      loadTasks(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    if (!user) return;

    try {
      const data = await ProjectService.getAllProjects(user.id);
      setProjects(data);

      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      } else if (data.length === 0) {
        setSelectedProject(null);
        setTasks([]);
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasks = async (projectId: string) => {
    try {
      const data = await TaskService.getTasksByProject(projectId);
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const handleCreateProject = async (data: { title: string; description: string }) => {
    if (!user) return;

    try {
      const newProject = await ProjectService.createProject(user.id, data);
      setProjects([newProject, ...projects]);
      setSelectedProject(newProject);
      setIsProjectModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      alert('Erro ao criar projeto. Tente novamente.');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Deseja realmente excluir este projeto? Todas as tarefas serão perdidas.')) return;

    try {
      await ProjectService.deleteProject(projectId);
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);

      if (selectedProject?.id === projectId) {
        setSelectedProject(updatedProjects[0] || null);
      }
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      alert('Erro ao excluir projeto. Tente novamente.');
    }
  };

  const handleCreateTask = async (data: { title: string; description: string; status: string }) => {
    if (!selectedProject) return;

    try {
      if (editingTask) {
        await TaskService.updateTask(editingTask.id, data);
      } else {
        await TaskService.createTask({
          project_id: selectedProject.id,
          ...data,
        });
      }
      loadTasks(selectedProject.id);
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      alert('Erro ao salvar tarefa. Tente novamente.');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Meus Projetos</h2>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Projeto</span>
            </button>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <div
                  key={project.id}
                  className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition group ${
                    selectedProject?.id === project.id
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <FolderOpen
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          selectedProject?.id === project.id ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Excluir projeto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Crie seu primeiro projeto para começar a organizar suas tarefas
              </p>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Primeiro Projeto</span>
              </button>
            </div>
          )}
        </div>

        {selectedProject && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedProject.title}</h2>
                {selectedProject.description && (
                  <p className="text-gray-600 mt-1">{selectedProject.description}</p>
                )}
              </div>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Nova Tarefa</span>
              </button>
            </div>

            <KanbanBoard
              tasks={tasks}
              columns={selectedProject.columns}
              onTaskUpdate={() => loadTasks(selectedProject.id)}
              onEditTask={handleEditTask}
            />
          </div>
        )}
      </div>

      <ModalCreateProject
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      {selectedProject && (
        <ModalCreateTask
          isOpen={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          onSubmit={handleCreateTask}
          columns={selectedProject.columns}
          editingTask={editingTask}
        />
      )}
    </div>
  );
}
