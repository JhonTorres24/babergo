import { useTareas } from '../context/TareasContext';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Inicio() {
  const { tareas, actualizarTarea } = useTareas();

  const pendientes = tareas.filter(t => t.estado !== 'completada').length;
  const completadas = tareas.filter(t => t.estado === 'completada').length;

  const marcarCompletada = (id: string) => {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
      actualizarTarea({ ...tarea, estado: 'completada' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
      {/* Saludo */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors">¡Hola, estudiante! 👋</h2>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1 transition-colors">Aquí tienes el resumen de tu avance académico.</p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tareas Pendientes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendientes}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completadas</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{completadas}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Racha de Estudio</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">5 días</p>
          </div>
        </div>
      </div>

      {/* Lista de Tareas Recientes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 md:p-6 transition-colors">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tareas Recientes</h3>
        
        {tareas.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No hay tareas por ahora. ¡Todo bajo control!</p>
        ) : (
          <div className="space-y-3">
            {tareas.map(tarea => (
              <div key={tarea.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors gap-4">
                <div>
                  <h4 className={`font-medium ${tarea.estado === 'completada' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                    {tarea.titulo}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tarea.descripcion}</p>
                </div>
                
                {tarea.estado !== 'completada' && (
                  <button 
                    onClick={() => marcarCompletada(tarea.id)}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-md transition-colors w-full sm:w-auto shrink-0"
                  >
                    <CheckCircle2 size={16} />
                    Completar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}