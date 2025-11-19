import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { projectService } from "../services/projectService";
import type { Project } from "../services/projectService";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");

  const openProject = (id: number) => {
  navigate("/upload", { state: { projectId: id } });
};

  const loadProjects = async () => {
    try {
      if (!user?.id) return;
      const data = await projectService.getProjects(user.id);
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!name.trim() || !user) return;

    const newProject = await projectService.createProject({
      name,
      user_id: user.id,
    });

    setProjects([...projects, newProject]);
    setName("");
  };

  const deleteProject = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

    await projectService.deleteProject(id);
    setProjects(projects.filter((p) => p.id !== id));
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setEditName(project.name);
  };

  const saveEdit = async () => {
    if (!editingProject || !editName.trim()) return;

    const updated = await projectService.updateProject(editingProject.id, {
      name: editName,
    });

    setProjects(
      projects.map((p) => (p.id === editingProject.id ? updated : p))
    );

    setEditingProject(null);
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      
      <div className="pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-white mb-1">
              Tus Proyectos
            </h1>
            <p className="text-gray-300 text-lg">
              Gestiona tus proyectos antes de procesar archivos.
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-10 border border-gray-700">
          <h2 className="text-white text-xl font-semibold mb-4">Crear Proyecto</h2>

          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Nombre del proyecto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            />
            <button
              onClick={createProject}
              className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg"
            >
              Crear
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-300">Cargando proyectos...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-300 text-lg">No tienes proyectos todavía.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 transition"
              >
                <div onClick={() => openProject(p.id)} className="cursor-pointer">
                  <div className="w-full h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {p.name}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm text-center">
                    Creado: {new Date(p.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => startEditing(p)}
                    className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center pb-8">
        <h2 className="text-white text-2xl font-bold mb-2">Elige un proyecto para continuar</h2>
        <svg
          className="w-6 h-6 text-white mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 border border-gray-600">
            <h2 className="text-white text-xl mb-4">Editar Proyecto</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            />

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => setEditingProject(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={saveEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
