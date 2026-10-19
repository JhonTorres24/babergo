import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface PomodoroContextType {
  tiempoRestante: number;
  estaCorriendo: boolean;
  modo: 'estudio' | 'descanso';
  minEstudio: number;
  minDescanso: number;
  iniciar: () => void;
  pausar: () => void;
  reiniciar: () => void;
  cambiarModo: (nuevoModo: 'estudio' | 'descanso') => void;
  guardarConfiguracion: (estudio: number, descanso: number) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  // Guardamos los minutos configurados en LocalStorage (por defecto 25 y 5)
  const [config, setConfig] = useLocalStorage('babergo_pomodoro_config', { estudio: 25, descanso: 5 });
  
  const [modo, setModo] = useState<'estudio' | 'descanso'>('estudio');
  const [tiempoRestante, setTiempoRestante] = useState(config.estudio * 60);
  const [estaCorriendo, setEstaCorriendo] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (estaCorriendo && tiempoRestante > 0) {
      intervalRef.current = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0) {
      setEstaCorriendo(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      alert(modo === 'estudio' ? '¡Sesión completada! Tómate un descanso.' : '¡Descanso terminado! A seguir estudiando.');
      
      const nuevoModo = modo === 'estudio' ? 'descanso' : 'estudio';
      setModo(nuevoModo);
      setTiempoRestante(nuevoModo === 'estudio' ? config.estudio * 60 : config.descanso * 60);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [estaCorriendo, tiempoRestante, modo, config]);

  const iniciar = () => setEstaCorriendo(true);
  const pausar = () => setEstaCorriendo(false);
  
  const reiniciar = () => {
    setEstaCorriendo(false);
    setTiempoRestante(modo === 'estudio' ? config.estudio * 60 : config.descanso * 60);
  };

  const cambiarModo = (nuevoModo: 'estudio' | 'descanso') => {
    setEstaCorriendo(false);
    setModo(nuevoModo);
    setTiempoRestante(nuevoModo === 'estudio' ? config.estudio * 60 : config.descanso * 60);
  };

  const guardarConfiguracion = (estudio: number, descanso: number) => {
    setConfig({ estudio, descanso });
    // Si no está corriendo, actualizamos el reloj con los nuevos tiempos
    if (!estaCorriendo) {
      setTiempoRestante(modo === 'estudio' ? estudio * 60 : descanso * 60);
    }
  };

  return (
    <PomodoroContext.Provider value={{ 
      tiempoRestante, estaCorriendo, modo, 
      minEstudio: config.estudio, minDescanso: config.descanso,
      iniciar, pausar, reiniciar, cambiarModo, guardarConfiguracion 
    }}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) throw new Error('usePomodoro debe usarse dentro de un PomodoroProvider');
  return context;
}