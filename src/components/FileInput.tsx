
import { useState, type DragEvent, type ChangeEvent } from "react";

interface FileInputProps {
  onUpload: (file: File) => void;
}

// Validadores
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB en bytes
const ALLOWED_FORMATS = ['video/avi', 'video/mp4', 'audio/mp3', 'video/x-matroska']; // avi, mp4, mp3, mkv

const validateFile = async (file: File): Promise<{ isValid: boolean; error?: string }> => {
  // AQUI ESTA EL VALIDADOR DE TAMAÑO
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'El archivo excede el tamaño máximo de 1GB' };
  }

  // AQUI ESTA EL VALIDADOR DE FORMATO
  if (!ALLOWED_FORMATS.includes(file.type)) {
    return { isValid: false, error: 'Formato no permitido. Solo se aceptan: AVI, MP4, MP3, MKV' };
  }

  // AQUI ESTA EL VALIDADOR DE RESOLUCIÓN (solo para videos)
  if (file.type.startsWith('video/')) {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          const width = video.videoWidth;
          const height = video.videoHeight;
          
          // Validar resolución mínima (opcional)
          if (width < 320 || height < 240) {
            resolve({ isValid: false, error: 'La resolución mínima es 320x240' });
          } else {
            resolve({ isValid: true });
          }
        };
        
        video.onerror = () => {
          resolve({ isValid: false, error: 'No se pudo leer el archivo de video' });
        };
        
        video.src = URL.createObjectURL(file);
      });
    } catch (error) {
      return { isValid: false, error: 'Error al validar el video' };
    }
  }

  return { isValid: true };
};

export const FileInput = ({ onUpload }: FileInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);  

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setIsValidating(true);
      const validation = await validateFile(droppedFile);
      setIsValidating(false);
      
      if (validation.isValid) {
        onUpload(droppedFile);
      } else {
        setError(validation.error || 'Error de validación');
      }
    } 
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setError(null);
      setIsValidating(true);
      const validation = await validateFile(selectedFile);
      setIsValidating(false);
      
      if (validation.isValid) {
        onUpload(selectedFile);
      } else {
        setError(validation.error || 'Error de validación');
      }
    }
  };

  return (
    <div>
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}
          ${isValidating ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="mb-2 text-sm">
          {isValidating ? "Validando archivo..." : "Arrastra y suelta tu video aquí"} <br /> 
          {!isValidating && "o haz clic para seleccionarlo"}
        </span>
        <input 
          type="file" 
          accept="video/avi,video/mp4,audio/mp3,video/x-matroska" 
          className="hidden" 
          onChange={handleChange}
          disabled={isValidating}
        />
      </label>
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
