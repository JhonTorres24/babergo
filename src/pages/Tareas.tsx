import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // <-- Agregados
import { useTareas } from '../context/TareasContext';
import { CheckCircle2, Trash2, Search, Clock } from 'lucide-react';

export default function Tareas() {
  const { tareas, actualizarTarea, eliminarTarea } = useTareas();
  const [busqueda, setBusqueda] = useState('');
  
  // Hacemos que la página reciba el texto de búsqueda desde la barra superior
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) setBusqueda(query);
  }, [location]);

  const tareasFiltradas = tareas.filter(t => 
    t.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminar = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      eliminarTarea(id);
    }
  };

  const marcarCompletada = (id: string) => {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
      actualizarTarea({ ...tarea, estado: 'completada' });
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'media': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'baja': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors">Mis Tareas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona todas tus actividades académicas.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar tarea..." 
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              // Si el usuario borra el buscador, limpiamos la URL
              if (e.target.value === '') navigate('/tareas');
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
        {tareasFiltradas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <CheckCircle2 size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {busqueda ? 'No se encontraron tareas' : 'Todo está bajo control'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {busqueda ? `No hay resultados para "${busqueda}"` : 'No tienes tareas pendientes por ahora.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {tareasFiltradas.map(tarea => (
              <li key={tarea.id} className="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`font-semibold text-lg ${tarea.estado === 'completada' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                      {tarea.titulo}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${getPrioridadColor(tarea.prioridad)}`}>
                      {tarea.prioridad}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{tarea.descripcion || 'Sin descripción'}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Creada: {new Date(tarea.creadaEn).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:ml-4">
                  {tarea.estado !== 'completada' && (
                    <button 
                      onClick={() => marcarCompletada(tarea.id)}
                      className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-md transition-colors"
                    >
                      <CheckCircle2 size={16} />
                      <span className="hidden sm:inline">Completar</span>
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleEliminar(tarea.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Eliminar tarea"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}