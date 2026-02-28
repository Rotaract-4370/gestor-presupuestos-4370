<script setup>
  import Boton from './UI/Boton.vue';
  const props = defineProps({
    data: {type: Object, default: () => ({})},
    gastadoEvento: {type: Number, default: 0}
  })
  const emit = defineEmits(['gestion-evento', 'state-modal'])
</script>

<template>
  <div
    class="flex flex-row w-full justify-between items-center"
  >
    <div
      class="flex flex-row gap-3 w-full"
    >
      <i 
        @click="emit('gestion-evento')"
        class="
          cursor-pointer hover:text-white/80
          text-3xl md:text-4xl text-white bi bi-arrow-left-short
        "
      ></i>
      <div
        class="flex flex-col justify-start w-full"
      >
        <p 
          class="md:text-xl capitalize poppins-normal truncate text-white"
        >{{ props.data.nombre }}</p>
        <p
          class="text-xs md:text-ms poppins-normal text-white/50"
        >{{ props.data.fecha }}</p>
      </div>
    </div>
    <Boton 
      v-if="((gastadoEvento / props.data.presupuesto) * 100) !== 100"
      @click="emit('state-modal')"
      icono="bi bi-plus"
      color="bg-slate-600 text-white w-[25%] hover:bg-slate-500 cursor-not-allowed"
    >Agregar Gasto</Boton>
  </div>
</template>
