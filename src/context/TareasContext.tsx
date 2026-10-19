import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Tarea } from '../types';

const tareasIniciales: Tarea[] = [
  {
    id: '1',
    titulo: 'Avanzar el proyecto de Babergo',
    descripcion: 'Terminar el dashboard y conectar las tareas',
    cursoId: 'curso-1',
    fechaEntrega: new Date().toISOString(),
    prioridad: 'alta',
    estado: 'pendiente',
    subtareas: [],
    creadaEn: new Date().toISOString(),
  },
  {
    id: '2',
    titulo: 'Leer el capítulo 4 de Cálculo',
    descripcion: 'Páginas 80 a 120',
    cursoId: 'curso-2',
    fechaEntrega: new Date(Date.now() + 86400000).toISOString(),
    prioridad: 'media',
    estado: 'en_progreso',
    subtareas: [{ id: 's1', titulo: 'Hacer resumen', completada: false }],
    creadaEn: new Date().toISOString(),
  }
];

interface TareasContextType {
  tareas: Tarea[];
  agregarTarea: (tarea: Tarea) => void;
  eliminarTarea: (id: string) => void;
  actualizarTarea: (tarea: Tarea) => void;
}

const TareasContext = createContext<TareasContextType | undefined>(undefined);

export function TareasProvider({ children }: { children: ReactNode }) {
  const [tareas, setTareas] = useLocalStorage<Tarea[]>('babergo_tareas', tareasIniciales);

  const agregarTarea = (nuevaTarea: Tarea) => {
    setTareas((prev) => [nuevaTarea, ...prev]);
  };

  const eliminarTarea = (id: string) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
  };

  const actualizarTarea = (tareaActualizada: Tarea) => {
    setTareas((prev) => prev.map((t) => (t.id === tareaActualizada.id ? tareaActualizada : t)));
  };

  return (
    <TareasContext.Provider value={{ tareas, agregarTarea, eliminarTarea, actualizarTarea }}>
      {children}
    </TareasContext.Provider>
  );
}

export function useTareas() {
  const context = useContext(TareasContext);
  if (!context) {
    throw new Error('useTareas debe usarse dentro de un TareasProvider');
  }
  return context;
}