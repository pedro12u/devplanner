import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  static async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (signUpError) throw new Error(signUpError.message);
    if (!authData.user) throw new Error('Erro ao criar usuário');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: data.name,
        });
    }

    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      name: data.name,
      created_at: authData.user.created_at,
    };

    const token = authData.session?.access_token || '';

    return { user, token };
  }

  static async login(data: LoginData): Promise<{ user: User; token: string }> {
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) throw new Error('Email ou senha inválidos');
    if (!authData.user) throw new Error('Erro ao fazer login');

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      name: profile?.name || authData.user.email!.split('@')[0],
      created_at: authData.user.created_at,
    };

    const token = authData.session?.access_token || '';

    return { user, token };
  }

  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  static async getSession(): Promise<{ user: User; token: string } | null> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    const user: User = {
      id: session.user.id,
      email: session.user.email!,
      name: profile?.name || session.user.email!.split('@')[0],
      created_at: session.user.created_at,
    };

    return {
      user,
      token: session.access_token,
    };
  }

  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }
}
