import { useTareas } from '../context/TareasContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart2, PieChart as PieIcon } from 'lucide-react';

export default function Estadisticas() {
  const { tareas } = useTareas();

  // --- CÁLCULOS PARA EL GRÁFICO DE BARRAS (Completadas vs Pendientes) ---
  const completadas = tareas.filter(t => t.estado === 'completada').length;
  const pendientes = tareas.length - completadas;

  const dataEstado = [
    { name: 'Completadas', cantidad: completadas, fill: '#22c55e' }, // Verde
    { name: 'Pendientes', cantidad: pendientes, fill: '#f59e0b' },   // Naranja
  ];

  // --- CÁLCULOS PARA EL GRÁFICO CIRCULAR (Prioridad) ---
  const alta = tareas.filter(t => t.prioridad === 'alta').length;
  const media = tareas.filter(t => t.prioridad === 'media').length;
  const baja = tareas.filter(t => t.prioridad === 'baja').length;

  const dataPrioridad = [
    { name: 'Alta', value: alta, color: '#ef4444' },  // Rojo
    { name: 'Media', value: media, color: '#f59e0b' }, // Naranja
    { name: 'Baja', value: baja, color: '#3b82f6' },   // Azul
  ].filter(d => d.value > 0); // Solo mostrar si hay datos

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Estadísticas</h1>
        <p className="text-gray-500 mt-1">Analiza tu rendimiento y carga académica.</p>
      </div>

      {tareas.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <BarChart2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aún no hay datos suficientes</h3>
          <p className="text-gray-500 mt-1">Agrega y completa tareas para ver tus gráficos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Gráfico 1: Estado de las Tareas */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="text-indigo-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Tareas por Estado</h2>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataEstado} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                    {dataEstado.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Distribución por Prioridad */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <PieIcon className="text-indigo-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Distribución por Prioridad</h2>
            </div>
            
            <div className="h-64 w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPrioridad}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataPrioridad.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}