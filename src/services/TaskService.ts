import { supabase } from '../lib/supabase';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  project_id: string;
  title: string;
  description?: string;
  status?: string;
}

export class TaskService {
  static async getTasksByProject(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
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
}
