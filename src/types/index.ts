export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  cursoId: string;
  fechaEntrega: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en_progreso' | 'completada';
  subtareas: { id: string; titulo: string; completada: boolean }[];
  creadaEn: string;
}

export interface Curso {
  id: string;
  nombre: string;
  docente: string;
  color: string;
  creditos: number;
}

export interface Clase {
  id: string;
  cursoId: string;
  nombreCurso: string;
  dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  horaInicio: string;
  horaFin: string;
  aula: string;
  color: string;
}

// NUEVO TIPO: Nota
export interface Nota {
  id: string;
  cursoNombre: string;
  evaluacion: string;
  calificacion: number;
  peso: number; // Porcentaje (ej: 30 para 30%)
}