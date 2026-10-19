import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inicio from './pages/Inicio';
import Tareas from './pages/Tareas';
import Horario from './pages/Horario';
import Notas from './pages/Notas';
import Concentracion from './pages/Concentracion';
import Asistente from './pages/Asistente';
import Estadisticas from './pages/Estadisticas';
import Ajustes from './pages/Ajustes';
import Cursos from './pages/Cursos';
import Logros from './pages/Logros'; // <-- Importamos Logros
import { TareasProvider } from './context/TareasContext';
import { PomodoroProvider } from './context/PomodoroContext';
import { TemaProvider } from './context/TemaContext';

function App() {
  return (
    <TemaProvider>
      <TareasProvider>
        <PomodoroProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Inicio />} />
                <Route path="tareas" element={<Tareas />} />
                <Route path="horario" element={<Horario />} />
                <Route path="notas" element={<Notas />} />
                <Route path="concentracion" element={<Concentracion />} />
                <Route path="asistente" element={<Asistente />} />
                <Route path="estadisticas" element={<Estadisticas />} />
                <Route path="ajustes" element={<Ajustes />} />
                <Route path="cursos" element={<Cursos />} />
                <Route path="logros" element={<Logros />} /> {/* <-- Conectado */}
              </Route>
            </Routes>
          </BrowserRouter>
        </PomodoroProvider>
      </TareasProvider>
    </TemaProvider>
  );
}

export default App;