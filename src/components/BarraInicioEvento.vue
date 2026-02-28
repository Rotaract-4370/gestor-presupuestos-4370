<script setup>
  import Boton from './UI/Boton.vue';
  const props = defineProps({
    data: {type: Object, default: () => ({})},
    gastadoEvento: {type: Number, default: 0}
  })
  const emit = defineEmits(['gestion-evento'])

  const stateModal = () => {
    emit('gestion-evento')
  }
</script>

<template>
  <div
    class="flex flex-row w-full justify-between items-center"
  >
    <div
      class="flex flex-row gap-3"
    >
      <i 
        @click="emit('gestion-evento')"
        class="
          cursor-pointer hover:text-white/80
          text-3xl md:text-4xl text-white bi bi-arrow-left-short
        "
      ></i>
      <div
        class="flex flex-col justify-start"
      >
        <p 
          class="md:text-xl capitalize poppins-normal text-white"
        >{{ props.data.nombre }}</p>
        <p
          class="text-xs md:text-ms poppins-normal text-white/50"
        >{{ props.data.fecha }}</p>
      </div>
    </div>
    <Boton 
      v-if="((gastadoEvento / props.data.presupuesto) * 100) !== 100"
      @click="stateModal"
      icono="bi bi-plus"
      color="bg-slate-600 text-white hover:bg-slate-500 cursor-not-allowed"
    >Agregar Gasto</Boton>
  </div>
</template>
