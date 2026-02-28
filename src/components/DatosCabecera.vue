<script setup>
  import useFormatCadena from '../composables/useFormatoMoneda';

  const props = defineProps({
    titulo: { type: String },
    icono: { type: String },
    monto: { type : Number },
    texto: { type: String },
    porcentaje: { type: Number },
    barra: { type: Boolean }
  })
  const { formatearCadena } = useFormatCadena();
 

</script>

<template>
  <div class="w-full flex flex-col gap-9">
    <div 
      class="px-8 py-5 flex flex-row items-center justify-between rounded-xl w-full"
    >
      <p
        class="poppins-normal font-bold text-xl text-gray-700"
      >{{ props.titulo }}</p>
      <i 
        :class=props.icono
        class="text-2xl text-gray-700"
      ></i>
    </div>
    <div class="flex flex-col px-8 w-full">
      <p
      v-if="props.monto > 0 || props.titulo === 'Eventos Activos'"
        class="text-2xl font-bold mb-3 text-gray-700"
        :class="
          {'text-red-700' : props.titulo === 'Restante' && props.porcentaje > 80 },
          {'text-green-700' : props.titulo === 'Restante' && props.monto > 0 }
        "
      >{{ `${props.titulo !== 'Eventos Activos' ? formatearCadena(props.monto) : props.monto}` }}</p>
      <p v-else class="text-2xl font-bold mb-3 text-gray-700">--</p>
    <div 
      v-if="props.barra"
      class="h-[5.2px] w-full rounded bg-blue-200 mb-2" 
    >
      <div class="bg-blue-500 h-full rounded" :style="{width: `${props.porcentaje}%`}"></div>
    </div>
      <p
        class="text-sm text-gray-600"
      >{{ props.texto }}</p>
    </div>
  </div>
 
</template>
