import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, CheckSquare, BookOpen, BarChart2, Settings, Menu, X, Calculator, Timer, Sparkles, Trophy, User, LogOut, ChevronDown } from 'lucide-react';
import ModalTarea from './ModalTarea';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- FUNCIÓN PARA CALCULAR EL CICLO ACTUAL AUTOMÁTICAMENTE ---
  const obtenerCicloActual = () => {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1; // getMonth() va de 0 a 11

    // Regla: De Enero a Junio es Ciclo I, de Julio a Diciembre es Ciclo II
    const ciclo = mes <= 6 ? 'I' : 'II';
    return `CICLO ${anio}-${ciclo}`;
  };

  const menuItems = [
    { path: '/', name: 'Inicio', icon: Home },
    { path: '/horario', name: 'Mi Horario', icon: Calendar },
    { path: '/tareas', name: 'Tareas', icon: CheckSquare },
    { path: '/cursos', name: 'Mis Cursos', icon: BookOpen },
    { path: '/notas', name: 'Notas', icon: Calculator },
    { path: '/asistente', name: 'Asistente IA', icon: Sparkles },
    { path: '/concentracion', name: 'Concentración', icon: Timer },
    { path: '/logros', name: 'Logros', icon: Trophy },
    { path: '/estadisticas', name: 'Estadísticas', icon: BarChart2 },
    { path: '/ajustes', name: 'Ajustes', icon: Settings },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (busquedaGlobal.trim()) {
      navigate(`/tareas?q=${encodeURIComponent(busquedaGlobal.trim())}`);
      setBusquedaGlobal('');
    }
  };

  return (
    <div className="flex h-screen bg-[#F7F7F7] dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-200">
      
      <aside className="hidden md:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col z-20 transition-colors duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">Babergo</h1>
          {/* AQUÍ LLAMAMOS A LA FUNCIÓN AUTOMÁTICA */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest font-semibold">
            {obtenerCicloActual()}
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMenu}></div>
          <aside className="relative w-64 max-w-sm bg-white dark:bg-gray-800 h-full flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">Babergo</h1>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest font-semibold">
                  {obtenerCicloActual()}
                </p>
              </div>
              <button onClick={closeMenu} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"><X size={24} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={closeMenu} 
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8 z-10 transition-colors duration-200">
          <div className="flex items-center gap-3 md:gap-6 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"><Menu size={24} /></button>
            
            <form onSubmit={handleBusqueda} className="w-full max-w-xs md:max-w-md">
              <input 
                type="text" 
                placeholder="Buscar tareas y presionar Enter..." 
                value={busquedaGlobal}
                onChange={(e) => setBusquedaGlobal(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-500 dark:placeholder-gray-400" 
              />
            </form>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 ml-2">
            <button onClick={() => setIsTaskModalOpen(true)} className="hidden sm:block text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm">+ Nueva Tarea</button>
            <button onClick={() => setIsTaskModalOpen(true)} className="sm:hidden text-white bg-indigo-600 p-2 rounded-md hover:bg-indigo-700 shadow-sm">+</button>
            
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
                  E
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Estudiante Demo</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">estudiante@universidad.edu</p>
                  </div>
                  
                  <Link to="/ajustes" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <User size={16} className="text-gray-400" />
                    Mi Perfil
                  </Link>
                  
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      alert('Sesión cerrada (Simulación de Demo)');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <ModalTarea isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
    </div>
  );
}