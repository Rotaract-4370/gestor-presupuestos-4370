<script setup>
  import Boton from './UI/Boton.vue';

  defineEmits(['stateModal'])
  const props = defineProps({
    modal: {type: Boolean, default: false}
  })

</script>

<template>
  <div class="flex flex-row items-center justify-between px-10 w-full">
    <div class="flex flex-row items-center justify-center gap-5">
      <i 
        class="bi bi-grid text-2xl font-extrabold text-gray-100"
      ></i>
      <p
        class="text-gray-100 text-2xl poppins-bold"
      >Mis Eventos</p>
    </div>
    <Boton 
      icono="bi bi-plus"
      @click="$emit('stateModal')"
      :v-show="props.modal"
      color="bg-slate-600 text-white hover:bg-slate-500 cursor-not-allowed"
    >Nuevo Evento</Boton>
  </div>
  
  
</template>
