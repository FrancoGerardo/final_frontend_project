import { useState } from "react";
import { HomePage } from "../components/HomePage";
import { LoadingScreen } from "../components/LoadingScreen";
import { ResultsPage } from "../components/ResultsPage";
import { API_BASE_URL } from "../services/authService";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  // Estado eliminado: no usado en UI
  const [originalVideoUrl, setOriginalVideoUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Limpiar job_id anterior
    sessionStorage.removeItem("currentJobId");
    // Guardar nombre original (sin extensión) para usarlo en la descarga del instrumental
    const originalName = selectedFile.name.split('.').slice(0, -1).join('.');
    sessionStorage.setItem('originalFileName', originalName);
    
    // Crear URL para vista previa del video original
    const videoUrl = URL.createObjectURL(selectedFile);
    setOriginalVideoUrl(videoUrl);
  };

  const handleAutoProcess = async (selectedFile: File) => {
    setLoading(true);

    try {
      console.log("Procesando video automáticamente:", selectedFile.name);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_BASE_URL}/procesar-video/`, {
        method: "POST",
        headers: {
          // No establecer Content-Type manualmente; el navegador lo hace con boundary
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Intentar leer el header X-Job-ID que el backend debe exponer
      const headerJobId = response.headers.get("X-Job-ID");
      if (!headerJobId) {
        // Si no se pudo leer el header, informar al usuario
        alert("No se recibió job_id. Comprueba CORS/expose_headers.");
        console.error("Header X-Job-ID ausente: si usas CORS el backend debe exponerlo con expose_headers=[\"X-Job-ID\"]");
      } else {
        // Guardar jobId en sessionStorage
        sessionStorage.setItem("currentJobId", headerJobId);
      }

      // Obtener el nombre original sin extensión y agregar "_karaoke" para la descarga del video karaoke
      const originalName = selectedFile.name.split('.').slice(0, -1).join('.');
      const downloadName = `${originalName}_karaoke.mp4`;

      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      console.log("Video procesado y descargado automáticamente");
    } catch (error: unknown) {
      console.error("Error al procesar el video:", error instanceof Error ? error.message : String(error));
      alert("Ocurrió un error al procesar el video.");
    } finally {
      setLoading(false);
    }
  };

  // handleUpload removido: flujo usa handleAutoProcess

  // Descarga instrumental gestionada desde ResultsPage

  return (
    <>
      {!file ? (
        <HomePage 
          onFileSelect={handleFileSelect}
          onAutoProcess={handleAutoProcess}
        />
      ) : loading ? (
        <LoadingScreen 
          loading={loading}
          fileName={file.name}
        />
      ) : (
        <ResultsPage
          originalVideoUrl={originalVideoUrl}
          jobId={sessionStorage.getItem("currentJobId")}
          originalFileName={sessionStorage.getItem('originalFileName')}
        />
      )}
    </>
  );
};

export default UploadPage;