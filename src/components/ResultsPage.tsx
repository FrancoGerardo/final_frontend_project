import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../services/authService";

interface ResultsPageProps {
  originalVideoUrl: string | null;
  jobId: string | null;
  originalFileName: string | null;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ 
  originalVideoUrl, 
  jobId, 
  originalFileName 
}) => {
  const { logout } = useAuth();
  
  // Estados del reproductor de video
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  // Estados de las pistas de audio
  const [audioStates, setAudioStates] = useState({
    original: { isPlaying: false, currentTime: 0, duration: 0 },
    vocals: { isPlaying: false, currentTime: 0, duration: 0 },
    background: { isPlaying: false, currentTime: 0, duration: 0 }
  });
  
  // Referencias
  const videoRef = useRef<HTMLVideoElement>(null);
  const originalAudioRef = useRef<HTMLAudioElement>(null);
  const vocalsAudioRef = useRef<HTMLAudioElement>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

  // Funciones del reproductor de video
  const handleVideoPlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // El volumen se controla con mute/unmute para simplificar

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Función para generar ondas dinámicas basadas en tiempo actual
  // Cantidad de barras por pista
  const BASE_WAVE_COUNT = 2000;

  // Formas base por pista (se generan una sola vez)
  const baseWavesRef = useRef<Record<string, number[]>>({
    original: Array.from({ length: BASE_WAVE_COUNT }, () => Math.random() * 100),
    vocals: Array.from({ length: BASE_WAVE_COUNT }, () => Math.random() * 100),
    background: Array.from({ length: BASE_WAVE_COUNT }, () => Math.random() * 100)
  });

  const getBaseWaves = (trackId: string): number[] => {
    return baseWavesRef.current[trackId] || Array.from({ length: BASE_WAVE_COUNT }, () => 50);
  };

  const generateDynamicWaves = (baseWaves: number[], isPlaying: boolean, currentTime: number, duration: number) => {
    if (!isPlaying || duration === 0) {
      // Mantener forma estática cuando no está reproduciendo
      return baseWaves;
    }

    const progress = currentTime / duration;
    return baseWaves.map((wave, index) => {
      const timeOffset = (index / baseWaves.length) * 2;
      const dynamicFactor = Math.sin((currentTime + timeOffset) * 0.1) * 0.3 + 0.7;
      const progressFactor = Math.sin(progress * Math.PI) * 0.2 + 0.8;
      return wave * dynamicFactor * progressFactor;
    });
  };

  // Funciones de audio
  const handlePlay = (trackId: keyof typeof audioStates) => {
    // Pausar todas las pistas primero
    pauseAllAudioTracks();
    
    // Reproducir la pista seleccionada
    let audioEl: HTMLAudioElement | null;
    switch (trackId) {
      case 'original':
        audioEl = originalAudioRef.current;
        break;
      case 'vocals':
        audioEl = vocalsAudioRef.current;
        break;
      case 'background':
        audioEl = backgroundAudioRef.current;
        break;
      default:
        return;
    }

    if (audioEl) {
      audioEl.play();
      setAudioStates(prev => ({
        ...prev,
        [trackId]: { ...prev[trackId], isPlaying: true }
      }));
    }
  };

  const handlePause = () => {
    pauseAllAudioTracks();
    setAudioStates(prev => ({
      original: { ...prev.original, isPlaying: false },
      vocals: { ...prev.vocals, isPlaying: false },
      background: { ...prev.background, isPlaying: false }
    }));
  };

  const pauseAllAudioTracks = () => {
    [originalAudioRef, vocalsAudioRef, backgroundAudioRef].forEach(ref => {
      if (ref.current) {
        ref.current.pause();
      }
    });
  };

  // Función para actualizar estado de audio específico
  const updateAudioState = (trackId: keyof typeof audioStates, updates: Partial<{isPlaying: boolean, currentTime: number, duration: number}>) => {
    setAudioStates(prev => ({
      ...prev,
      [trackId]: { ...prev[trackId], ...updates }
    }));
  };

  // useEffect para manejar eventos del video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // useEffect para manejar eventos de audio original
  useEffect(() => {
    const audio = originalAudioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => updateAudioState('original', { currentTime: audio.currentTime });
    const handleLoadedMetadata = () => updateAudioState('original', { duration: audio.duration });
    const handlePlay = () => updateAudioState('original', { isPlaying: true });
    const handlePause = () => updateAudioState('original', { isPlaying: false });
    const handleEnded = () => updateAudioState('original', { isPlaying: false });

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // useEffect para manejar eventos de audio vocals
  useEffect(() => {
    const audio = vocalsAudioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => updateAudioState('vocals', { currentTime: audio.currentTime });
    const handleLoadedMetadata = () => updateAudioState('vocals', { duration: audio.duration });
    const handlePlay = () => updateAudioState('vocals', { isPlaying: true });
    const handlePause = () => updateAudioState('vocals', { isPlaying: false });
    const handleEnded = () => updateAudioState('vocals', { isPlaying: false });

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // useEffect para manejar eventos de audio background
  useEffect(() => {
    const audio = backgroundAudioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => updateAudioState('background', { currentTime: audio.currentTime });
    const handleLoadedMetadata = () => updateAudioState('background', { duration: audio.duration });
    const handlePlay = () => updateAudioState('background', { isPlaying: true });
    const handlePause = () => updateAudioState('background', { isPlaying: false });
    const handleEnded = () => updateAudioState('background', { isPlaying: false });

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Funciones de descarga
  const handleDownloadAll = () => {
    if (jobId) {
      window.location.href = `${API_BASE_URL}/descargar/todo/${encodeURIComponent(jobId)}`;
    }
  };

  const handleDownloadKaraoke = () => {
    if (jobId) {
      window.location.href = `${API_BASE_URL}/descargar/video_karaoke/${encodeURIComponent(jobId)}`;
    }
  };

  const handleDownloadOriginal = () => {
    if (jobId) {
      window.location.href = `${API_BASE_URL}/descargar/audio_original/${encodeURIComponent(jobId)}`;
    }
  };

  const handleDownloadVocals = () => {
    if (jobId) {
      window.location.href = `${API_BASE_URL}/descargar/audio_vocals/${encodeURIComponent(jobId)}`;
    }
  };

  const handleDownloadInstrumental = () => {
    if (jobId) {
      window.location.href = `${API_BASE_URL}/descargar/audio_instrumental/${encodeURIComponent(jobId)}`;
    }
  };

  // Botones placeholder removidos para evitar funciones sin uso

  const tracks: { id: 'original' | 'vocals' | 'background'; title: string; waveformColor: string; currentTime: string; duration: string }[] = [
    {
      id: 'original',
      title: 'Audio Original',
      waveformColor: '#60A5FA', // blue-400
      currentTime: '00:04',
      duration: '06:28'
    },
    {
      id: 'vocals',
      title: 'Voces',
      waveformColor: '#34D399', // emerald-400
      currentTime: '00:04',
      duration: '06:28'
    },
    {
      id: 'background',
      title: 'Música de Fondo',
      waveformColor: '#34D399', // emerald-400
      currentTime: '00:05',
      duration: '06:28'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="flex h-screen">
        {/* Sección izquierda - Pistas de audio */}
        <div className="flex-1 p-6">
          {/* Header con botón de regreso y cerrar sesión */}
          <div className="flex items-center justify-between mb-6">
            <button className="text-gray-400 hover:text-white transition-colors mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-white text-xl font-semibold">Pistas de Audio</h2>
            <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg">
              Cerrar sesión
            </button>
          </div>

          {/* Reproductor de video karaoke ARRIBA de las pistas */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Título del video */}
              <h3 className="text-black text-lg font-medium mb-4">
                {originalFileName ? `${originalFileName} - Karaoke` : 'Video Karaoke'}
              </h3>
              
              {/* Reproductor de video */}
              <div className="bg-black rounded-lg overflow-hidden">
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={jobId ? `${API_BASE_URL}/descargar/video_karaoke_preview/${encodeURIComponent(jobId)}` : originalVideoUrl || undefined}
                    className="w-full h-80 object-cover"
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setDuration(videoRef.current.duration);
                      }
                    }}
                  />
                  {/* Overlay de controles personalizados */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
                    <div className="flex items-center space-x-4">
                      {/* Botón de play */}
                      <button 
                        onClick={handleVideoPlayPause}
                        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                      >
                        {isPlaying ? (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      {/* Tiempo actual */}
                      <span className="text-white text-sm">{formatTime(currentTime)}</span>
                      
                      {/* Barra de progreso */}
                      <div className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer" onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const percentage = clickX / rect.width;
                        const newTime = percentage * duration;
                        handleVideoSeek(newTime);
                      }}>
                        <div 
                          className="h-1 bg-white rounded-full transition-all duration-200" 
                          style={{width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'}}
                        ></div>
                      </div>
                      
                      {/* Duración total */}
                      <span className="text-white text-sm">{formatTime(duration)}</span>
                      
                      {/* Botón de volumen */}
                      <button 
                        onClick={handleToggleMute}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isMuted || volume === 0 ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 2.007A.75.75 0 0110 2.75v14.5a.75.75 0 01-1.617.493L5.66 14.5H3.25A.75.75 0 012.5 13.75v-7.5a.75.75 0 01.75-.75h2.41l2.723-2.743a.75.75 0 011.009-.003zM15.53 9.47a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm-2.69-2.69a.75.75 0 010 1.06L11.72 9.53a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 2.007A.75.75 0 0110 2.75v14.5a.75.75 0 01-1.617.493L5.66 14.5H3.25A.75.75 0 012.5 13.75v-7.5a.75.75 0 01.75-.75h2.41l2.723-2.743a.75.75 0 011.009-.003zM16.25 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      {/* Botón de pantalla completa */}
                      <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pistas de audio */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {tracks.map((track) => {
              const audioState = audioStates[track.id as keyof typeof audioStates];
              const isPlaying = audioState.isPlaying;
              const currentTime = audioState.currentTime;
              const duration = audioState.duration;
              // Usar forma base por pista y animarla solo si está reproduciendo
              const baseWaves = getBaseWaves(track.id);
              const dynamicWaves = generateDynamicWaves(baseWaves, isPlaying, currentTime, duration);
              
              return (
                <div 
                  key={track.id}
                  className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
                    isPlaying ? 'ring-2 ring-blue-500 bg-gray-750' : ''
                  }`}
                  onClick={() => isPlaying ? handlePause() : handlePlay(track.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium text-lg">{track.title}</h3>
                    <div className="flex items-center space-x-3">
                      <button className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                        {isPlaying ? (
                          <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <span className="text-gray-400 text-sm font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Waveform visual dinámico */}
                  <div className="flex items-end space-x-0 h-12">
                    {dynamicWaves.map((height, index) => (
                      <div
                        key={index}
                        className={`w-0.5 rounded-full transition-all duration-200 ${
                          isPlaying ? 'opacity-100' : 'opacity-70'
                        } hover:opacity-100`}
                        style={{
                          height: `${height}%`,
                          backgroundColor: track.waveformColor
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sección derecha - Panel de descarga */}
        <div className="w-80 bg-gray-900 p-6 flex flex-col justify-start">
          {/* Botón Descargar Todo - alineado con el centro del video */}
          <div className="mb-8">
            <button 
              onClick={handleDownloadAll}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Descargar Todo</span>
            </button>
          </div>

          {/* Botones de descarga por audio - alineados exactamente con cada card */}
          <div className="space-y-4">
            {/* Descargar Karaoke - altura exacta de card */}
            <div className="h-20 flex items-center">
              <button 
                onClick={handleDownloadKaraoke}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Descargar Karaoke</span>
              </button>
            </div>

            {/* Descargar Audio Original - altura exacta de card */}
            <div className="h-20 flex items-center">
              <button 
                onClick={handleDownloadOriginal}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Descargar Audio</span>
              </button>
            </div>

            {/* Descargar Audio Vocal - altura exacta de card */}
            <div className="h-20 flex items-center">
              <button 
                onClick={handleDownloadVocals}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Descargar Audio (Vocal)</span>
              </button>
            </div>

            {/* Descargar Audio Instrumental - altura exacta de card */}
            <div className="h-20 flex items-center">
              <button 
                onClick={handleDownloadInstrumental}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Descargar Audio Instrumental</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Elementos de audio ocultos */}
      <audio
        ref={originalAudioRef}
        src={jobId ? `${API_BASE_URL}/descargar/audio_original/${encodeURIComponent(jobId)}` : undefined}
        preload="metadata"
      />
      <audio
        ref={vocalsAudioRef}
        src={jobId ? `${API_BASE_URL}/descargar/audio_vocals/${encodeURIComponent(jobId)}` : undefined}
        preload="metadata"
      />
      <audio
        ref={backgroundAudioRef}
        src={jobId ? `${API_BASE_URL}/descargar/audio_instrumental/${encodeURIComponent(jobId)}` : undefined}
        preload="metadata"
      />
    </div>
  );
};
