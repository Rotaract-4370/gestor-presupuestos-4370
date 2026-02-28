<script setup>
  import { titulosEventos } from '../helpers/Config';
  import useFormatCadena from '../composables/useFormatoMoneda';

  const { formatearCadena } = useFormatCadena()

  const props = defineProps({
    data: {type: Object, default: () => ({})},
    gastadoEvento: {type: Number, default: 0}
  })

</script>

<template>
  <div
    v-for="(item, index) in titulosEventos"
    :key="index"
    class="bg-white px-5 py-5 h-44 rounded-2xl cont-secundary shadow-sm flex flex-col justify-between border border-gray-100"
  >
    <div class="flex flex-row w-full justify-between items-center">
      <p class="text-gray-600 font-medium text-[11px] md:text-xs tracking-wider">
        {{ item.nombre }}
      </p>
      <i :class="[item.icono, 'text-xl text-gray-600']"></i>
    </div>

    <div class="flex flex-col gap-2">
      <p 
        v-if="item.nombre === 'Presupuesto'"
        class="text-2xl poppins-normal text-gray-700"
      >
        {{ formatearCadena(props.data.presupuesto) }}
      </p>

      <div v-if="item.nombre === 'Gastado'" class="mt-2 flex flex-row w-full justify-between items-center">
        <p class="text-xl md:text-2xl poppins-normal text-gray-700">
          {{formatearCadena(gastadoEvento)}}
        </p>
        <p 
          class="text-[12px] text-gray-600 mt-1 uppercase hidden md:block"
          :class="{'text-red-600' : (gastadoEvento / props.data.presupuesto) * 100 > 80,
            'text-green-600' : (gastadoEvento / props.data.presupuesto) * 100 < 80 && (gastadoEvento / props.data.presupuesto) * 100 > 0
          }"
        >
          {{ ((gastadoEvento / props.data.presupuesto) * 100) }}% consumido
        </p>
        <p 
          class="text-[12px] text-gray-600 mt-1 uppercase md:hidden"
          :class="{'text-red-600' : (gastadoEvento / props.data.presupuesto) * 100 > 80,
            'text-green-600' : (gastadoEvento / props.data.presupuesto) * 100 < 80 && (gastadoEvento / props.data.presupuesto) * 100 > 0
          }"
        >
          {{ ((gastadoEvento / props.data.presupuesto) * 100) }}%
        </p>
      </div>
      
      <div 
        v-if="item.nombre === 'Restante'"
        class="flex flex-row w-full justify-between items-center "
        :class="(props.data.presupuesto - gastadoEvento) < 0 ? 'text-red-500' : 'text-green-600'"
      >
        <p class="text-2xl poppins-normal">
          {{formatearCadena(props.data.presupuesto - gastadoEvento)}}
        </p>
        <p 
          v-if="item.nombre === 'Restante'"
          class="text-xs font-medium hidden md:block"
        >
          {{ (props.data.presupuesto - gastadoEvento) < 0 ? 'Presupuesto excedido' : 'Disponible' }}
        </p>
      </div>
      
    </div>
  </div>
</template>
