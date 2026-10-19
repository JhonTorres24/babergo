import { useState } from 'react';
import { X } from 'lucide-react';
import { useTareas } from '../context/TareasContext';
import type { Tarea } from '../types';

interface ModalTareaProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalTarea({ isOpen, onClose }: ModalTareaProps) {
  const { agregarTarea } = useTareas();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState<'alta' | 'media' | 'baja'>('media');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const nuevaTarea: Tarea = {
      id: crypto.randomUUID(),
      titulo,
      descripcion,
      cursoId: 'general',
      fechaEntrega: new Date().toISOString(),
      prioridad,
      estado: 'pendiente',
      subtareas: [],
      creadaEn: new Date().toISOString(),
    };

    agregarTarea(nuevaTarea);
    
    setTitulo('');
    setDescripcion('');
    setPrioridad('media');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Ventana Modal con clases dark: */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-colors">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nueva Tarea</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título de la tarea *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-400"
              placeholder="Ej: Terminar informe de laboratorio"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (opcional)</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24 placeholder-gray-400 dark:placeholder-gray-400"
              placeholder="Detalles de la tarea..."
            />
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
            <select
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value as 'alta' | 'media' | 'baja')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="alta">Alta 🔥</option>
              <option value="media">Media ⚡</option>
              <option value="baja">Baja 🌱</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm"
            >
              Guardar Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}