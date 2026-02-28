<script setup>
import { computed } from 'vue'
import useFormatCadena from '../composables/useFormatoMoneda'

const props = defineProps({
  evento: { type: Object, required: true }
})

const gastadoEvento = computed(() => {
  return props.evento?.gastos?.reduce((acc, g) => acc + (Number(g.monto) || 0), 0) || 0
})

defineEmits(['gestion-evento', 'eliminar-evento'])

const { formatearCadena } = useFormatCadena()

</script>

<template>
  <div 
    class="p-6 flex flex-col justify-between h-full w-full poppins-normal"
  > 
      <div class="flex flex-row justify-between">
      <h3 class="text-xl font-bold text-gray-800 poppins-bold truncate">{{ props.evento.nombre }}</h3>
      <i 
        @click="$emit('eliminar-evento', props.evento)"
        class="
        bg-red-100 px-2 py-1 rounded-full
        bi bi-x-lg hover:text-red-700 cursor-pointer text-sm
        transition-all duration-300 ease-in-out active:scale-105"
      ></i>
    </div>
    <div 
    @click="$emit('gestion-evento', props.evento)"
      class="mt-4 cursor-pointer active:scale-105
      transition-all duration-300 ease-in-out
      hover:bg-slate-300 rounded-2xl 
      px-1 pt-1
      ">
      <div 
        class="flex justify-between items-center mb-3"
      >
        <p class="text-sm text-gray-500"><i class="bi bi-calendar-event"></i> {{ props.evento.fecha }}</p>
        <p class="text-sm text-gray-700 px-2 py-1 bg-gray-200 rounded-full">Activo</p>
      </div>
    
      <div 
        class="flex justify-between items-center mb-2 pr-1"
      >
        <p class="text-sm text-gray-500">{{ `${formatearCadena(gastadoEvento)} / ${formatearCadena(props.evento.presupuesto)}` }}</p>
        <p class="text-sm text-gray-700">{{ `${(gastadoEvento / props.evento.presupuesto) * 100}%`}}</p>
      </div>
      <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          :class="{'bg-green-500 h-full': (gastadoEvento / props.evento.presupuesto) * 100 < 80,
            'bg-red-500 h-full': (gastadoEvento / props.evento.presupuesto) * 100 > 80 || (gastadoEvento / props.evento.presupuesto) * 100 === 100
          }" 
          :style="{ width: `${(gastadoEvento / props.evento.presupuesto) * 100}%` }"
        ></div>
      </div>
    </div>

    <div class="flex flex-row justify-between">
      <p 
        class="text-sm text-gray-500 flex flex-row items-center"
      >{{ props.evento.gastos?.length || 0 }} gastos</p>
      <p class="text-sm text-gray-500 flex flex-row items-center gap-2">
        <span>{{ formatearCadena(props.evento.presupuesto - gastadoEvento) }}</span>
        disponible
      </p>
    </div>
  </div>
</template>
