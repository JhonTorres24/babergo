import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Trash2 } from 'lucide-react';
import type { Clase } from '../types';

const generarHoras = () => {
  const horas = [];
  for (let i = 6; i <= 23; i++) {
    horas.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return horas;
};

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const horas = generarHoras();

const coloresClases = [
  'bg-blue-100 dark:bg-blue-900/40 border-blue-500 dark:border-blue-400 text-blue-800 dark:text-blue-200',
  'bg-green-100 dark:bg-green-900/40 border-green-500 dark:border-green-400 text-green-800 dark:text-green-200',
  'bg-purple-100 dark:bg-purple-900/40 border-purple-500 dark:border-purple-400 text-purple-800 dark:text-purple-200',
  'bg-orange-100 dark:bg-orange-900/40 border-orange-500 dark:border-orange-400 text-orange-800 dark:text-orange-200',
  'bg-pink-100 dark:bg-pink-900/40 border-pink-500 dark:border-pink-400 text-pink-800 dark:text-pink-200',
];

export default function Horario() {
  const [clases, setClases] = useLocalStorage<Clase[]>('babergo_horario', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoCurso, setNuevoCurso] = useState('');
  const [nuevoDia, setNuevoDia] = useState('Lunes');
  const [nuevaHoraInicio, setNuevaHoraInicio] = useState('08:00');
  const [nuevaHoraFin, setNuevaHoraFin] = useState('10:00');
  const [nuevaAula, setNuevaAula] = useState('');

  const handleAgregarClase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCurso.trim()) return;
    if (nuevaHoraFin <= nuevaHoraInicio) {
      alert('La hora de fin debe ser mayor a la hora de inicio.');
      return;
    }

    const nuevaClase: Clase = {
      id: crypto.randomUUID(),
      cursoId: 'general', 
      nombreCurso: nuevoCurso,
      dia: nuevoDia as any,
      horaInicio: nuevaHoraInicio,
      horaFin: nuevaHoraFin,
      aula: nuevaAula,
      color: coloresClases[Math.floor(Math.random() * coloresClases.length)],
    };

    setClases([...clases, nuevaClase]);
    setIsModalOpen(false);
    setNuevoCurso(''); setNuevaAula('');
  };

  const handleEliminarClase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Eliminar esta clase del horario?')) {
      setClases(clases.filter(c => c.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors">Mi Horario</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Organiza tus clases de la semana.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors font-medium shadow-sm"
        >
          <Plus size={18} /> Agregar Clase
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 sticky top-0 z-20">
              <div className="p-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                Hora
              </div>
              {dias.map(dia => (
                <div key={dia} className="p-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 last:border-0">
                  {dia}
                </div>
              ))}
            </div>

            <div className="relative">
              {horas.map((hora) => (
                <div key={hora} className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="p-3 text-center text-xs font-medium text-gray-400 dark:text-gray-500 border-r border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/20">
                    {hora}
                  </div>

                  {dias.map(dia => {
                    const clasesEnEsteBloque = clases.filter(c => c.dia === dia && c.horaInicio === hora);

                    if (clasesEnEsteBloque.length > 0) {
                      return (
                        <div key={`${dia}-${hora}`} className="p-1 relative border-r border-gray-50 dark:border-gray-700 last:border-0 h-16">
                          {clasesEnEsteBloque.map(clase => {
                            const inicio = parseInt(clase.horaInicio.split(':')[0]);
                            const fin = parseInt(clase.horaFin.split(':')[0]);
                            const duracion = fin - inicio;

                            return (
                              <div 
                                key={clase.id}
                                className={`absolute top-1 left-1 right-1 rounded-md border-l-4 p-2 shadow-sm z-10 group cursor-pointer ${clase.color}`}
                                style={{ height: `calc(${duracion * 64}px - 8px)` }}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-bold text-sm leading-tight">{clase.nombreCurso}</p>
                                    <p className="text-xs opacity-80 mt-1">{clase.aula}</p>
                                    <p className="text-xs opacity-80">{clase.horaInicio} - {clase.horaFin}</p>
                                  </div>
                                  <button 
                                    onClick={(e) => handleEliminarClase(clase.id, e)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                                    title="Eliminar clase"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    return <div key={`${dia}-${hora}`} className="p-1 h-16 border-r border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"></div>;
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Agregar Nueva Clase</h2>
            </div>
            <form onSubmit={handleAgregarClase} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del curso *</label>
                <input type="text" required value={nuevoCurso} onChange={e => setNuevoCurso(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Cálculo II" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Día</label>
                  <select value={nuevoDia} onChange={e => setNuevoDia(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none">
                    {dias.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aula</label>
                  <input type="text" value={nuevaAula} onChange={e => setNuevaAula(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: 302" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora Inicio</label>
                  <select value={nuevaHoraInicio} onChange={e => setNuevaHoraInicio(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none">
                    {horas.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora Fin</label>
                  <select value={nuevaHoraFin} onChange={e => setNuevaHoraFin(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none">
                    {horas.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm">Guardar Clase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}