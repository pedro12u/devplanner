import { supabase } from '../lib/supabase';

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  columns: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  title: string;
  description?: string;
}

export class ProjectService {
  static async getAllProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map(project => ({
      ...project,
      columns: project.columns as string[],
    }));
  }

  static async getProjectById(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      ...data,
      columns: data.columns as string[],
    };
  }

  static async createProject(userId: string, projectData: CreateProjectData): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        title: projectData.title,
        description: projectData.description || '',
        columns: ['A Fazer', 'Fazendo', 'Feito'],
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      ...data,
      columns: data.columns as string[],
    };
  }

  static async updateProject(
    projectId: string,
    updates: Partial<CreateProjectData>
  ): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      ...data,
      columns: data.columns as string[],
    };
  }

  static async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw new Error(error.message);
  }
}
