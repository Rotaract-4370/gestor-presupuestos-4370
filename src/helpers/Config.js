import { computed, reactive } from 'vue'

const totalPresupuesto = computed(() => {
  return listaEventos.reduce((acc, ev) => acc + (Number(ev.presupuesto) || 0), 0)
})

const totalGastado = computed(() => {
  return listaEventos.reduce((acc, ev) => {
    const sumaGastosEvento = ev.gastos?.reduce((a, b) => a + (Number(b.monto) || 0), 0) || 0
    return acc + sumaGastosEvento
  }, 0)
})

const totalGastadoPorcentaje = computed(() => {
  if (totalPresupuesto.value === 0) return 0;
  
  const porcentaje = (totalGastado.value / totalPresupuesto.value) * 100;
  
  return Math.round(porcentaje); 
})

const restante = computed(() => totalPresupuesto.value - totalGastado.value)
const totalEventos = computed(() => listaEventos.length)

export const estiloCategoria = (cat) => {
  const fondo = 'px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider'
  const estilos = {
    'Comida': 'bg-orange-100 text-orange-600',
    'Servicios': 'bg-blue-100 text-blue-600',
    'Compra': 'bg-purple-100 text-purple-600',
    'Otros': 'bg-gray-100 text-gray-600'
  }
  return `${estilos[cat]} ${fondo}` || `bg-gray-100 text-gray-600 ${fondo}`
}

export const cabecera = computed(() => [
  { 
    titulo: 'Presupuesto Total', 
    icono: 'bi bi-wallet', 
    valor: totalPresupuesto.value, 
    text: `${listaEventos.length} eventos registrados`,
    showBar: false 
  },
  { 
    titulo: 'Total Gastado', 
    icono: 'bi bi-currency-dollar', 
    valor: totalGastado.value, 
    text: `${totalGastadoPorcentaje.value}% del presupuesto`,
    porcentaje: totalGastadoPorcentaje.value,
    showBar: true 
  },
  { 
    titulo: 'Restante', 
    icono: 'bi bi-cash', 
    valor: restante.value, 
    text: 'disponible para gastar',
    showBar: false
  },
  { 
    titulo: 'Eventos Activos', 
    icono: 'bi bi-calendar-event', 
    valor: totalEventos.value, 
    text: 'proximos',
    showBar: false
  }
])

export const titulosEventos = [
  {nombre: 'Presupuesto', icono: 'bi bi-wallet'},
  {nombre: 'Gastado', icono: 'bi bi-currency-dollar'},
  {nombre: 'Restante', icono: 'bi bi-cash'},
]

export const listaEventos = reactive([])


