import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Trash2, Calculator } from 'lucide-react';
import type { Nota } from '../types';

export default function Notas() {
  const [notas, setNotas] = useLocalStorage<Nota[]>('babergo_notas', []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [curso, setCurso] = useState('');
  const [evaluacion, setEvaluacion] = useState('');
  const [calificacion, setCalificacion] = useState('');
  const [peso, setPeso] = useState('');

  const handleAgregarNota = (e: React.FormEvent) => {
    e.preventDefault();
    const notaNum = parseFloat(calificacion);
    const pesoNum = parseFloat(peso);

    if (isNaN(notaNum) || isNaN(pesoNum) || !curso.trim() || !evaluacion.trim()) return;

    if (notaNum < 0 || notaNum > 20 || pesoNum <= 0 || pesoNum > 100) {
      alert('Verifica los valores. Nota (0-20) y Peso (1-100).');
      return;
    }

    const nuevaNota: Nota = {
      id: crypto.randomUUID(),
      cursoNombre: curso.trim(),
      evaluacion: evaluacion.trim(),
      calificacion: notaNum,
      peso: pesoNum,
    };

    setNotas([...notas, nuevaNota]);
    setIsModalOpen(false);
    setCurso(''); setEvaluacion(''); setCalificacion(''); setPeso('');
  };

  const handleEliminarNota = (id: string) => {
    if (window.confirm('¿Eliminar esta nota?')) {
      setNotas(notas.filter(n => n.id !== id));
    }
  };

  const cursosUnicos = Array.from(new Set(notas.map(n => n.cursoNombre.trim().toUpperCase())));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors">Control de Notas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Calcula tus promedios ponderados.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors font-medium shadow-sm"
        >
          <Plus size={18} />
          Registrar Nota
        </button>
      </div>

      {cursosUnicos.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm transition-colors">
          <Calculator size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay notas registradas</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Empieza agregando tus calificaciones para ver tu promedio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cursosUnicos.map(cursoNombreFormateado => {
            const notasCurso = notas.filter(n => n.cursoNombre.trim().toUpperCase() === cursoNombreFormateado);
            const pesoTotal = notasCurso.reduce((acc, curr) => acc + curr.peso, 0);
            const promedioPonderado = notasCurso.reduce((acc, curr) => acc + (curr.calificacion * (curr.peso / 100)), 0);
            const estaCompleto = pesoTotal >= 100;

            return (
              <div key={cursoNombreFormateado} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col transition-colors">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cursoNombreFormateado}</h3>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Promedio</p>
                    <p className={`text-xl font-bold ${promedioPonderado >= 14 ? 'text-green-600 dark:text-green-400' : promedioPonderado >= 11 ? 'text-orange-500 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                      {promedioPonderado.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                    {notasCurso.map(nota => (
                      <li key={nota.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{nota.evaluacion}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Peso: {nota.peso}%</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                            {nota.calificacion.toFixed(1)}
                          </span>
                          <button onClick={() => handleEliminarNota(nota.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-3 text-sm text-center border-t transition-colors ${estaCompleto ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900/30'}`}>
                  {estaCompleto 
                    ? '✅ Porcentaje completo (100%)' 
                    : `⚠️ Falta completar el ${(100 - pesoTotal).toFixed(0)}% del curso`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Registrar Calificación</h2>
            </div>

            <form onSubmit={handleAgregarNota} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Curso *</label>
                <input type="text" required value={curso} onChange={e => setCurso(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Cálculo I" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Evaluación *</label>
                <input type="text" required value={evaluacion} onChange={e => setEvaluacion(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Examen Parcial" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nota (0-20) *</label>
                  <input type="number" step="0.1" min="0" max="20" required value={calificacion} onChange={e => setCalificacion(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="15" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peso (%) *</label>
                  <input type="number" min="1" max="100" required value={peso} onChange={e => setPeso(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="30" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}