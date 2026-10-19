import { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, X } from 'lucide-react';
import { usePomodoro } from '../context/PomodoroContext';

export default function Concentracion() {
  const { 
    tiempoRestante, estaCorriendo, modo, minEstudio, minDescanso,
    iniciar, pausar, reiniciar, cambiarModo, guardarConfiguracion 
  } = usePomodoro();

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [nuevoEstudio, setNuevoEstudio] = useState(minEstudio.toString());
  const [nuevoDescanso, setNuevoDescanso] = useState(minDescanso.toString());

  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  const tiempoFormateado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

  const tiempoTotal = (modo === 'estudio' ? minEstudio : minDescanso) * 60;
  const progreso = ((tiempoTotal - tiempoRestante) / tiempoTotal) * 100;

  const handleGuardarAjustes = (e: React.FormEvent) => {
    e.preventDefault();
    const est = parseInt(nuevoEstudio);
    const desc = parseInt(nuevoDescanso);

    if (est > 0 && desc > 0 && est <= 180 && desc <= 60) {
      guardarConfiguracion(est, desc);
      setIsConfigOpen(false);
    } else {
      alert('Por favor, ingresa tiempos válidos (Estudio máx 180m, Descanso máx 60m).');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 flex flex-col items-center justify-center min-h-[70vh]">
      
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Modo Concentración</h1>
        <p className="text-gray-500 dark:text-gray-400">Técnica Pomodoro personalizable.</p>
      </div>

      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg transition-colors">
        <button 
          onClick={() => cambiarModo('estudio')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${modo === 'estudio' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          Estudio ({minEstudio}m)
        </button>
        <button 
          onClick={() => cambiarModo('descanso')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${modo === 'descanso' ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          Descanso ({minDescanso}m)
        </button>
      </div>

      <div className="relative flex items-center justify-center w-72 h-72 rounded-full bg-white dark:bg-gray-800 shadow-xl border-4 border-gray-50 dark:border-gray-700 transition-colors">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle cx="144" cy="144" r="136" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-700" />
          <circle
            cx="144" cy="144" r="136" stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={136 * 2 * Math.PI}
            strokeDashoffset={136 * 2 * Math.PI * (1 - progreso / 100)}
            className={`transition-all duration-1000 ease-linear ${modo === 'estudio' ? 'text-indigo-600 dark:text-indigo-500' : 'text-green-500 dark:text-green-400'}`}
          />
        </svg>
        
        <div className="z-10 text-center">
          <p className="text-6xl font-bold text-gray-800 dark:text-gray-100 tracking-tighter tabular-nums transition-colors">
            {tiempoFormateado}
          </p>
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-2">
            {modo === 'estudio' ? 'Enfocado' : 'Descansando'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button 
          onClick={reiniciar}
          className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Reiniciar"
        >
          <RotateCcw size={24} />
        </button>
        
        <button 
          onClick={estaCorriendo ? pausar : iniciar}
          className={`p-6 rounded-full text-white shadow-lg transition-transform hover:scale-105 ${modo === 'estudio' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {estaCorriendo ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        
        <button 
          onClick={() => {
            setNuevoEstudio(minEstudio.toString());
            setNuevoDescanso(minDescanso.toString());
            setIsConfigOpen(true);
          }}
          className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Configurar Tiempos"
        >
          <Settings size={24} />
        </button>
      </div>

      {isConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsConfigOpen(false)}></div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transition-colors">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ajustar Temporizador</h2>
              <button onClick={() => setIsConfigOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20} /></button>
            </div>

            <form onSubmit={handleGuardarAjustes} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minutos de Estudio (1 - 180)</label>
                <input 
                  type="number" 
                  min="1" max="180" required
                  value={nuevoEstudio} 
                  onChange={e => setNuevoEstudio(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400 dark:placeholder-gray-400" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minutos de Descanso (1 - 60)</label>
                <input 
                  type="number" 
                  min="1" max="60" required
                  value={nuevoDescanso} 
                  onChange={e => setNuevoDescanso(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400 dark:placeholder-gray-400" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsConfigOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors">Guardar Tiempos</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}