<script lang="ts" setup>
import { estiloCategoria } from '../../helpers/Config'
import useFormatCadena from '../../composables/useFormatoMoneda'
const { formatearCadena } = useFormatCadena()
const props = defineProps ({
  gasto: Object,
})
defineEmits(['editar-gasto', 'eliminar-gasto'])
</script>

<template>
  <tr class="hover:bg-gray-50 transition-colors group">
    <td class="p-4 whitespace-nowrap">
      <p class="text-sm font-semibold text-gray-800 poppins-normal">{{ gasto.nombre }}</p>
    </td>
    
    <td class="p-4 whitespace-nowrap">
      <span 
        :class="estiloCategoria(gasto.categoria)"
      >
        {{ gasto.categoria }}
      </span>
    </td>

    <td class="p-4 whitespace-nowrap text-sm text-gray-500 poppins-normal">
      {{ gasto.fecha }}
    </td>

    <td class="p-4 whitespace-nowrap">
      <span class="text-sm font-bold text-gray-900">
        {{ formatearCadena(gasto.monto) }}
      </span>
    </td>

    <td class="p-4 whitespace-nowrap text-right">
      <div class="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          @click="$emit('editar-gasto', gasto)"
          class="text-blue-600 hover:text-blue-800"><i class="bi bi-pencil-square"></i></button>
        <button 
          @click="$emit('eliminar-gasto', gasto)"
          class="text-red-500 hover:text-red-700"><i class="bi bi-trash"></i></button>
      </div>
    </td>
  </tr>
</template>
