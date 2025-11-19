import { FileInput } from "./FileInput";


interface UploadCardProps {
  file: File | null;
  onUpload: (file: File) => void;  
}

export const UploadCard = ({ file, onUpload }: UploadCardProps) => {
  

  return (
    <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Subir Video Musical
      </h2>
      <FileInput onUpload={onUpload} />

      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Archivo seleccionado: <span className="font-medium">{file.name}</span>
          </p>          
        </div>
      )}
    </section>
  );
};