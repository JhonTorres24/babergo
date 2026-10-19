import { useTareas } from '../context/TareasContext';
import { Trophy, Star, Target, Zap, Flame, ShieldCheck, Lock } from 'lucide-react';

export default function Logros() {
  const { tareas } = useTareas();

  // --- CÁLCULO DE XP Y NIVEL ---
  const tareasCompletadas = tareas.filter(t => t.estado === 'completada').length;
  
  // Regla de negocio: 50 XP por cada tarea completada
  const xpTotal = tareasCompletadas * 50;
  
  // Regla de negocio: Nivel = (XP / 200) + 1 (Cada 200 XP subes de nivel)
  const nivel = Math.floor(xpTotal / 200) + 1;
  
  // Cálculo del progreso al siguiente nivel
  const xpParaSiguienteNivel = 200;
  const xpEnNivelActual = xpTotal % 200;
  const progresoNivel = (xpEnNivelActual / xpParaSiguienteNivel) * 100;

  // --- DEFINICIÓN DE INSIGNIAS ---
  const insignias = [
    {
      id: '1',
      titulo: 'Primer Paso',
      descripcion: 'Completa tu primera tarea.',
      icono: Star,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      desbloqueada: tareasCompletadas >= 1,
    },
    {
      id: '2',
      titulo: 'Estudiante Constante',
      descripcion: 'Completa 5 tareas.',
      icono: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      desbloqueada: tareasCompletadas >= 5,
    },
    {
      id: '3',
      titulo: 'Maestro de la Planificación',
      descripcion: 'Completa 10 tareas.',
      icono: Target,
      color: 'text-indigo-500',
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      desbloqueada: tareasCompletadas >= 10,
    },
    {
      id: '4',
      titulo: 'Sin Pendientes',
      descripcion: 'Llega a 20 tareas completadas.',
      icono: ShieldCheck,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30',
      desbloqueada: tareasCompletadas >= 20,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors">Mis Logros</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Gana experiencia y desbloquea recompensas por tu esfuerzo.</p>
      </div>

      {/* Tarjeta de Nivel y XP */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Adorno de fondo */}
        <div className="absolute -right-10 -top-10 opacity-20">
          <Trophy size={200} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 shadow-inner shrink-0">
            <span className="text-4xl font-extrabold">{nivel}</span>
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            <h2 className="text-2xl font-bold">Nivel {nivel}</h2>
            <p className="text-indigo-100 mt-1">¡Sigue así! Tienes {xpTotal} XP acumulados.</p>
            
            {/* Barra de progreso */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-medium text-indigo-100 mb-1">
                <span>{xpEnNivelActual} / {xpParaSiguienteNivel} XP</span>
                <span>Siguiente Nivel</span>
              </div>
              <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progresoNivel}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">XP Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{xpTotal} XP</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tareas Completadas</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{tareasCompletadas}</p>
          </div>
        </div>
      </div>

      {/* Sección de Insignias */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Insignias</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {insignias.map(insignia => {
            const Icono = insignia.icono;
            return (
              <div 
                key={insignia.id} 
                className={`p-6 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${
                  insignia.desbloqueada 
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:-translate-y-1' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 opacity-70 grayscale'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${insignia.bg} ${insignia.color}`}>
                  {insignia.desbloqueada ? <Icono size={32} /> : <Lock size={32} className="text-gray-400" />}
                </div>
                <h3 className={`font-bold mb-1 ${insignia.desbloqueada ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                  {insignia.titulo}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {insignia.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}