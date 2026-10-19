import { useTema } from '../context/TemaContext';
import { Moon, Sun, Monitor, Bell, Trash2 } from 'lucide-react';

export default function Ajustes() {
  const { tema, toggleTema } = useTema();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Ajustes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Personaliza tu experiencia en Babergo.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        
        {/* Sección Apariencia */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Apariencia</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Tema de la aplicación</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cambia entre modo claro y oscuro.</p>
            </div>
            
            <button 
              onClick={toggleTema}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              {tema === 'claro' ? (
                <><Moon size={18} /> Cambiar a Oscuro</>
              ) : (
                <><Sun size={18} /> Cambiar a Claro</>
              )}
            </button>
          </div>
        </div>

        {/* Sección Notificaciones (Maqueta visual) */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notificaciones</h2>
          
          <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Recordatorios de tareas</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recibe alertas antes de que venza una tarea.</p>
            </div>
            <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
            </div>
          </div>
        </div>

        {/* Sección Zona de peligro */}
        <div className="p-6 bg-red-50 dark:bg-red-900/10">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Zona de Peligro</h2>
          <p className="text-sm text-red-500 dark:text-red-300 mb-4">Una vez que borres tu cuenta, no hay vuelta atrás.</p>
          <button 
            onClick={() => alert('Para la demo, esto solo muestra una alerta.')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            Eliminar cuenta
          </button>
        </div>

      </div>
    </div>
  );
}