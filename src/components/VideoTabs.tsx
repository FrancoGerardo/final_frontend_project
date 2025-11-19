import { useState } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { API_BASE_URL } from "../services/authService";

interface VideoTabsProps {
  originalVideoUrl: string | null;
  jobId: string | null;
  originalFileName: string | null;
}

type TabType = 'original' | 'karaoke' | 'instrumental';

export const VideoTabs = ({ originalVideoUrl, jobId, originalFileName }: VideoTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('original');

  const tabs = [
    {
      id: 'original' as TabType,
      label: 'Video Original',
      disabled: !originalVideoUrl,
      getVideoUrl: () => originalVideoUrl,
      getTitle: () => `${originalFileName || 'Video'} - Original`
    },
    {
      id: 'karaoke' as TabType,
      label: 'Video Karaoke',
      disabled: !jobId,
      getVideoUrl: () => jobId ? `${API_BASE_URL}/descargar/video_karaoke_preview/${encodeURIComponent(jobId)}` : null,
      getTitle: () => `${originalFileName || 'Video'} - Karaoke`
    },
    {
      id: 'instrumental' as TabType,
      label: 'Pista Instrumental',
      disabled: !jobId,
      getVideoUrl: () => jobId ? `${API_BASE_URL}/descargar/video_instrumental/${encodeURIComponent(jobId)}` : null,
      getTitle: () => `${originalFileName || 'Video'} - Instrumental`
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const currentVideoUrl = activeTabData?.getVideoUrl() || null;
  const currentTitle = activeTabData?.getTitle() || '';

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Pestañas */}
      <div className="bg-white rounded-t-2xl shadow-lg">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : tab.disabled
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{tab.label}</span>
                {tab.disabled && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del reproductor */}
      <div className="bg-white rounded-b-2xl shadow-lg">
        {currentVideoUrl ? (
          <VideoPlayer src={currentVideoUrl} title={currentTitle} />
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {activeTabData?.disabled ? 'Video no disponible' : 'Selecciona un video'}
            </h3>
            <p className="text-sm text-gray-500">
              {activeTabData?.disabled 
                ? 'Este video aún no está disponible. Procesa un archivo primero.'
                : 'Sube un video para comenzar a reproducir.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};



