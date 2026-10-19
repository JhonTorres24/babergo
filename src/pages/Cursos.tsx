import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, BookOpen, Link as LinkIcon, FileText, Trash2, X } from 'lucide-react';

interface Material {
  id: string;
  titulo: string;
  tipo: 'apunte' | 'enlace';
  contenido: string; // Texto del apunte o URL del enlace
}

interface CursoData {
  id: string;
  nombre: string;
  docente: string;
  color: string;
  materiales: Material[];
}

const coloresCursos = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'
];

export default function Cursos() {
  const [cursos, setCursos] = useLocalStorage<CursoData[]>('babergo_cursos', []);
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<CursoData | null>(null);
  
  // Estados para nuevo curso
  const [nombreCurso, setNombreCurso] = useState('');
  const [docente, setDocente] = useState('');

  // Estados para nuevo material
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [tituloMaterial, setTituloMaterial] = useState('');
  const [tipoMaterial, setTipoMaterial] = useState<'apunte' | 'enlace'>('apunte');
  const [contenidoMaterial, setContenidoMaterial] = useState('');

  const handleCrearCurso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCurso.trim()) return;

    const nuevoCurso: CursoData = {
      id: crypto.randomUUID(),
      nombre: nombreCurso.trim(),
      docente: docente.trim(),
      color: coloresCursos[Math.floor(Math.random() * coloresCursos.length)],
      materiales: []
    };

    setCursos([...cursos, nuevoCurso]);
    setIsCursoModalOpen(false);
    setNombreCurso(''); setDocente('');
  };

  const handleAgregarMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoSeleccionado || !tituloMaterial.trim() || !contenidoMaterial.trim()) return;

    const nuevoMaterial: Material = {
      id: crypto.randomUUID(),
      titulo: tituloMaterial.trim(),
      tipo: tipoMaterial,
      contenido: contenidoMaterial.trim()
    };

    const cursosActualizados = cursos.map(c => 
      c.id === cursoSeleccionado.id ? { ...c, materiales: [...c.materiales, nuevoMaterial] } : c
    );

    setCursos(cursosActualizados);
    setCursoSeleccionado({ ...cursoSeleccionado, materiales: [...cursoSeleccionado.materiales, nuevoMaterial] });
    setIsMaterialModalOpen(false);
    setTituloMaterial(''); setContenidoMaterial('');
  };

  const eliminarMaterial = (cursoId: string, materialId: string) => {
    if (!window.confirm('¿Eliminar este material?')) return;
    
    const cursosActualizados = cursos.map(c => 
      c.id === cursoId ? { ...c, materiales: c.materiales.filter(m => m.id !== materialId) } : c
    );
    
    setCursos(cursosActualizados);
    if (cursoSeleccionado) {
      setCursoSeleccionado({ ...cursoSeleccionado, materiales: cursoSeleccionado.materiales.filter(m => m.id !== materialId) });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors">Mis Cursos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona tus cursos y guarda material de estudio.</p>
        </div>
        <button 
          onClick={() => setIsCursoModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors font-medium shadow-sm"
        >
          <Plus size={18} />
          Nuevo Curso
        </button>
      </div>

      {/* Grid de Cursos */}
      {cursos.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm transition-colors">
          <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay cursos creados</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Crea tu primer curso para empezar a organizar tus materiales.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map(curso => (
            <div key={curso.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col transition-colors">
              <div className={`h-2 w-full ${curso.color}`}></div>
              <div className="p-5 flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{curso.nombre}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{curso.docente || 'Sin docente'}</p>
                
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Materiales ({curso.materiales.length})</p>
                  {curso.materiales.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">No hay materiales aún.</p>
                  ) : (
                    <ul className="space-y-2">
                      {curso.materiales.map(m => (
                        <li key={m.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                          <div className="flex items-center gap-2 overflow-hidden">
                            {m.tipo === 'enlace' ? <LinkIcon size={14} className="text-indigo-500 shrink-0" /> : <FileText size={14} className="text-green-500 shrink-0" />}
                            <span className="truncate text-gray-700 dark:text-gray-300">{m.titulo}</span>
                          </div>
                          <button onClick={() => eliminarMaterial(curso.id, m.id)} className="text-gray-400 hover:text-red-500 shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => setCursoSeleccionado(curso)}
                  className="w-full text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Ver y añadir material
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: CREAR CURSO */}
      {isCursoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCursoModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Crear Nuevo Curso</h2>
              <button onClick={() => setIsCursoModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20}/></button>
            </div>
            <form onSubmit={handleCrearCurso} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Curso *</label>
                <input type="text" required value={nombreCurso} onChange={e => setNombreCurso(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Álgebra Lineal" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Docente (Opcional)</label>
                <input type="text" value={docente} onChange={e => setDocente(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Dr. Pérez" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsCursoModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm">Guardar Curso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VER CURSO Y AÑADIR MATERIAL */}
      {cursoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCursoSeleccionado(null)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{cursoSeleccionado.nombre}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{cursoSeleccionado.docente || 'Sin docente'}</p>
              </div>
              <button onClick={() => setCursoSeleccionado(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Materiales de Estudio</h3>
                <button onClick={() => setIsMaterialModalOpen(true)} className="text-sm flex items-center gap-1 font-medium text-white bg-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-700">
                  <Plus size={14}/> Añadir
                </button>
              </div>
              
              {cursoSeleccionado.materiales.length === 0 ? (
                <p className="text-center text-gray-400 dark:text-gray-500 py-8">Este curso no tiene materiales guardados.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {cursoSeleccionado.materiales.map(m => (
                    <div key={m.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-start gap-3 bg-gray-50/50 dark:bg-gray-900/20">
                      <div className="mt-1 shrink-0">
                        {m.tipo === 'enlace' ? <LinkIcon className="text-indigo-500" size={20}/> : <FileText className="text-green-500" size={20}/>}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{m.titulo}</h4>
                        {m.tipo === 'enlace' ? (
                          <a href={m.contenido} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate block mt-1">{m.contenido}</a>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{m.contenido}</p>
                        )}
                      </div>
                      <button onClick={() => eliminarMaterial(cursoSeleccionado.id, m.id)} className="text-gray-400 hover:text-red-500 shrink-0 p-1"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AÑADIR MATERIAL */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMaterialModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-colors">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Añadir Material</h2>
              <button onClick={() => setIsMaterialModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20}/></button>
            </div>
            <form onSubmit={handleAgregarMaterial} className="p-5 space-y-4">
              <div className="flex gap-2">
                <button type="button" onClick={() => setTipoMaterial('apunte')} className={`flex-1 py-2 text-sm font-medium rounded-md border ${tipoMaterial === 'apunte' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}>Apunte</button>
                <button type="button" onClick={() => setTipoMaterial('enlace')} className={`flex-1 py-2 text-sm font-medium rounded-md border ${tipoMaterial === 'enlace' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}>Enlace</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título *</label>
                <input type="text" required value={tituloMaterial} onChange={e => setTituloMaterial(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Fórmulas de derivadas" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{tipoMaterial === 'enlace' ? 'URL *' : 'Contenido *'}</label>
                {tipoMaterial === 'enlace' ? (
                  <input type="url" required value={contenidoMaterial} onChange={e => setContenidoMaterial(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
                ) : (
                  <textarea required value={contenidoMaterial} onChange={e => setContenidoMaterial(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24" placeholder="Escribe tus apuntes aquí..." />
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsMaterialModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm">Guardar Material</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}