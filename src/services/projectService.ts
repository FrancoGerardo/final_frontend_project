import { apiClient } from "./authService";

export interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export const projectService = {
  async getProjects(userId: number): Promise<Project[]> {
  const res = await apiClient.get(`/projects?userId=${userId}`);
  return res.data;
},

  async createProject(payload: { name: string; user_id: number }): Promise<Project> {
  const res = await apiClient.post("/projects", payload);
  return res.data;
},
async updateProject(
    id: number,
    payload: { name?: string; description?: string }
  ): Promise<Project> {
    const res = await apiClient.put(`/projects/${id}`, payload);
    return res.data;
  },

  async deleteProject(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  }
};
