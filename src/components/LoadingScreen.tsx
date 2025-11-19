import React from 'react';

interface LoadingScreenProps {
  loading: boolean;
  fileName?: string | null;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ loading, fileName }) => {
  if (!loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Removedor de Voz con IA</h1>
        <p className="text-gray-300 text-lg">Separa la voz, la música de fondo con un solo clic y genera tu karaoke.</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Panel izquierdo - Ejemplos visuales (igual que HomePage) */}
          <div className="space-y-6">
            {/* Tarjetas de ejemplo */}
            <div className="relative">
              {/* Tarjeta principal - Hombre cantando */}
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg mb-4">
                <div className="w-full h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Audio Original</p>
                  </div>
                </div>
              </div>

              {/* Flecha y nota musical */}
              <div className="absolute top-1/2 right-0 transform translate-x-8 -translate-y-1/2">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.316 6.246c.088-.66.176-1.32.176-2.065 0-1.14-.292-1.292-1.049-1.292-.716 0-1.37.392-1.37 1.292 0 .164.015.33.03.495l-1.12-1.12a3.964 3.964 0 00-2.786-1.133c-1.488 0-2.716.716-3.4 1.8-.342.54-.54 1.152-.54 1.8 0 .648.198 1.26.54 1.8.684 1.084 1.912 1.8 3.4 1.8.648 0 1.26-.198 1.8-.54l1.12 1.12c-.165-.015-.33-.03-.495-.03-.9 0-1.292.654-1.292 1.37 0 .757.152 1.049 1.292 1.049.745 0 1.405-.088 2.065-.176l.246.246c.088.66.176 1.32.176 2.065 0 1.14-.292 1.292-1.049 1.292-.716 0-1.37-.392-1.37-1.292 0-.164.015-.33.03-.495l1.12 1.12c.54-.342 1.152-.54 1.8-.54.648 0 1.26.198 1.8.54l1.12-1.12c-.165.015-.33.03-.495.03-.9 0-1.292-.654-1.292-1.37 0-.757-.152-1.049-1.292-1.049-.745 0-1.405.088-2.065.176l-.246-.246z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Tarjetas de resultado */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {/* BGM */}
                <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="w-full h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-3 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.617 14H3a1 1 0 01-1-1V7a1 1 0 011-1h2.617l2.766-2.793a1 1 0 011-.131zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-white font-medium mb-2">BGM</h3>
                  <div className="flex space-x-1 mb-2">
                    {[...Array(15)].map((_, i) => (
                      <div key={i} className="w-1 bg-blue-400 rounded-full" style={{height: `${Math.random() * 20 + 8}px`}} />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">۰۰۰</p>
                </div>

                {/* Vocal */}
                <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="w-full h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mb-3 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-white font-medium mb-2">Vocal</h3>
                  <div className="flex space-x-1 mb-2">
                    {[...Array(15)].map((_, i) => (
                      <div key={i} className="w-1 bg-emerald-400 rounded-full" style={{height: `${Math.random() * 20 + 8}px`}} />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">۰۰۰</p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Área de carga con estado de procesamiento */}
          <div className="bg-gray-800 rounded-lg p-8">
            {/* Selector de modo */}
            <div className="flex justify-end mb-6">
              <div className="bg-gray-700 rounded-lg px-4 py-2 flex items-center space-x-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.617 14H3a1 1 0 01-1-1V7a1 1 0 011-1h2.617l2.766-2.793a1 1 0 011-.131zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-sm">Voces y Música de Fondo</span>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Área de carga con estado de procesamiento */}
            <div className="border-2 border-dashed border-purple-500 rounded-lg p-12 text-center">
              <div className="space-y-4">
                {/* Spinner de carga */}
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                </div>
                
                <h3 className="text-white text-xl font-medium">Subiendo…</h3>
                <p className="text-gray-400">Procesando tu video para generar el karaoke</p>
                
                {/* Barra de progreso */}
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-6">
                  <div className="bg-purple-600 h-2.5 rounded-full animate-pulse" style={{width: '75%'}}></div>
                </div>
                
                {/* Botón de cancelar */}
                <div className="flex justify-center mt-4">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Información del archivo */}
            {fileName && (
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">Procesando:</p>
                <p className="text-white font-medium">{fileName}</p>
              </div>
            )}

            {/* Límite de duración */}
            <div className="flex items-center justify-center mt-6 space-x-2">
              <span className="text-gray-400">Máximo:</span>
              <div className="bg-gray-700 rounded px-3 py-1">
                <span className="text-white text-sm">60 Mins</span>
              </div>
            </div>

            {/* Formatos soportados */}
            <div className="mt-4 text-center">
              <span className="text-gray-400 text-sm">Compatible con: </span>
              <span className="text-white text-sm">
                .MP3, .MP4, .WAV, .AAC, .M4A, .WMA, .OGG, .FLAC, .AIFF, .M4R, .AMR, .OGA, .MOV, .MKV, .WEBM, .AVI, .M4V, .WMV, .TS, .RMVB, .APE, .OPUS, .MTS
              </span>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Ejemplos de audio */}
        <div className="text-center">
          <h3 className="text-white text-lg font-medium mb-6">¿Sin audio? Prueba con uno de estos</h3>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { title: "Ejemplo 1", duration: "03:10", bg: "from-green-400 to-blue-500" },
              { title: "Ejemplo 2", duration: "03:03", bg: "from-purple-400 to-pink-500" },
              { title: "Ejemplo 3", duration: "04:00", bg: "from-orange-400 to-red-500" }
            ].map((sample, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3 text-center shadow-lg">
                <div className={`w-full h-20 bg-gradient-to-br ${sample.bg} rounded mb-2 flex items-center justify-center`}>
                  <div className="text-white text-xs font-medium">{sample.title}</div>
                </div>
                <p className="text-white text-sm font-medium">{sample.title}</p>
                <p className="text-gray-400 text-xs">{sample.duration}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <h2 className="text-white text-2xl font-bold mb-2">Ofrecemos más</h2>
        <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

