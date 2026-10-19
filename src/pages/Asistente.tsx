import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useTareas } from '../context/TareasContext';

interface Mensaje {
  id: string;
  texto: string;
  emisor: 'usuario' | 'asistente';
}

export default function Asistente() {
  const { tareas } = useTareas();
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: '1',
      texto: '¡Hola! Soy tu asistente académico. Puedo ayudarte a organizar tu día o priorizar tus tareas. ¿Qué necesitas?',
      emisor: 'asistente'
    }
  ]);
  const [input, setInput] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const finDelChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finDelChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, escribiendo]);

  const generarRespuesta = (textoUsuario: string) => {
    const texto = textoUsuario.toLowerCase();
    const pendientes = tareas.filter(t => t.estado !== 'completada');

    if (pendientes.length === 0) return "¡Felicidades! No tienes tareas pendientes. Es un buen momento para adelantar materia o tomar un descanso.";
    if (texto.includes('organiza mi día') || texto.includes('hoy')) return `Tienes ${pendientes.length} tareas pendientes. Te sugiero empezar por esta: "${pendientes[0].titulo}" (Prioridad: ${pendientes[0].prioridad}).`;
    if (texto.includes('qué debería estudiar') || texto.includes('primero')) {
      const altaPrioridad = pendientes.find(t => t.prioridad === 'alta');
      if (altaPrioridad) return `Te recomiendo enfocarte YA en: "${altaPrioridad.titulo}". Tiene prioridad alta.`;
      return `No tienes tareas de prioridad alta, así que empieza por: "${pendientes[0].titulo}".`;
    }
    if (texto.includes('plan') || texto.includes('examen')) return "Para preparar un examen, te sugiero: 1. Estudiar 50 minutos usando el Modo Concentración. 2. Descansar 10 minutos.";
    if (texto.includes('analiza') || texto.includes('pendientes')) {
      const altas = pendientes.filter(t => t.prioridad === 'alta').length;
      return `He analizado tus tareas. Tienes ${pendientes.length} en total, de las cuales ${altas} son de prioridad ALTA.`;
    }
    return "Entiendo. Como asistente en modo local, te sugiero revisar tu pestaña de Tareas y usar el Modo Concentración.";
  };

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const nuevoMensajeUsuario: Mensaje = { id: crypto.randomUUID(), texto: input, emisor: 'usuario' };
    setMensajes(prev => [...prev, nuevoMensajeUsuario]);
    setInput('');
    setEscribiendo(true);

    setTimeout(() => {
      const respuesta = generarRespuesta(nuevoMensajeUsuario.texto);
      setMensajes(prev => [...prev, { id: crypto.randomUUID(), texto: respuesta, emisor: 'asistente' }]);
      setEscribiendo(false);
    }, 1500);
  };

  const enviarSugerencia = (texto: string) => {
    setInput(texto);
    setTimeout(() => {
      const event = new Event('submit', { cancelable: true, bubbles: true });
      document.getElementById('chat-form')?.dispatchEvent(event);
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
      
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Asistente Académico</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Modo Demostración Local</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {mensajes.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.emisor === 'usuario' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.emisor === 'usuario' ? 'bg-gray-800 dark:bg-gray-600 text-white' : 'bg-indigo-600 text-white'}`}>
              {msg.emisor === 'usuario' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.emisor === 'usuario' 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tr-sm' 
                : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 rounded-tl-sm border border-indigo-100 dark:border-indigo-800/50'
            }`}>
              {msg.texto}
            </div>
          </div>
        ))}
        
        {escribiendo && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center border border-indigo-100 dark:border-indigo-800/50">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={finDelChatRef} />
      </div>

      {mensajes.length === 1 && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {['Organiza mi día', '¿Qué debería estudiar primero?', 'Analiza mis tareas pendientes'].map(sugerencia => (
            <button 
              key={sugerencia}
              onClick={() => enviarSugerencia(sugerencia)}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50 px-3 py-1.5 rounded-full transition-colors"
            >
              {sugerencia}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form id="chat-form" onSubmit={handleEnviar} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-400 dark:placeholder-gray-400"
          />
          <button 
            type="submit"
            disabled={!input.trim() || escribiendo}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shrink-0"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}