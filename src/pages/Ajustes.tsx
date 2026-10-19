import { useTema } from '../context/TemaContext';
import { Moon, Sun, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Ajustes() {
  const { tema, toggleTema } = useTema();
  const [notificacionesActivas, setNotificacionesActivas] = useLocalStorage('babergo_notificaciones', true);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors">Ajustes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Personaliza tu experiencia en Babergo.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
        
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
                <><Moon size={18} /> Oscuro</>
              ) : (
                <><Sun size={18} /> Claro</>
              )}
            </button>
          </div>
        </div>

        {/* Sección Notificaciones */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notificaciones</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Recordatorios de tareas</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Muestra alertas visuales de tareas próximas a vencer.</p>
            </div>
            
            <button 
              onClick={() => setNotificacionesActivas(!notificacionesActivas)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${
                notificacionesActivas ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute transition-transform ${
                notificacionesActivas ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>
        </div>

        {/* Sección Zona de peligro */}
        <div className="p-6 bg-red-50 dark:bg-red-900/10">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Zona de Peligro</h2>
          <p className="text-sm text-red-500 dark:text-red-300 mb-4">Una vez que borres tu cuenta, no hay vuelta atrás.</p>
          <button 
            onClick={() => alert('Simulación: Para borrar la cuenta se necesitaría conectar Supabase.')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Trash2 size={16} />
            Eliminar cuenta
          </button>
        </div>

      </div>
    </div>
  );
}