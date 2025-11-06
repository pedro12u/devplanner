import { supabase } from '../lib/supabase';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tags: string[];
  category: string;
  color: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  project_id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string[];
  category?: string;
  color?: string | null;
}

export class TaskService {
  static async getTasksByProject(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    return data;
  }

  static async createTask(taskData: CreateTaskData): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        project_id: taskData.project_id,
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'A Fazer',
        priority: taskData.priority || 'media',
        tags: taskData.tags || [],
        category: taskData.category || 'geral',
        color: taskData.color || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  static async updateTask(
    taskId: string,
    updates: Partial<Omit<CreateTaskData, 'project_id'>>
  ): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  static async moveTask(taskId: string, newStatus: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  static async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw new Error(error.message);
  }

  static async reorderTasks(tasks: { id: string; order_index: number }[]): Promise<void> {
    const updates = tasks.map(task =>
      supabase
        .from('tasks')
        .update({ order_index: task.order_index })
        .eq('id', task.id)
    );

    await Promise.all(updates);
  }
}
