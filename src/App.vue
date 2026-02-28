<script setup>
import { ref, onMounted, watch } from 'vue';
import BarraIntermedia from './components/BarraIntermedia.vue';
import Cabecera from './components/Cabecera.vue';
import DatosCabecera from './components/DatosCabecera.vue';
import Modal from './components/UI/Modal/Modal.vue';
import EventosCard from './components/EventosCard.vue';
import SectionEvento from './components/SectionEvento.vue';

import { cabecera, listaEventos } from './helpers/Config';

//variables
const modal = ref(false);
const gestion = ref(false);
const dataEvento = ref({});

// funciones
const stateModal = () => {
  return modal.value = !modal.value
}
const tomarData = (data) => {
  const nuevoEvento = {
    ...data,
    gastos: []
  }
  listaEventos.push(nuevoEvento)
}
const guardarGasto = (data) => {
  // data may be a new gasto or an edited one; if it's already in the array by reference, don't push
  const gastos = dataEvento.value.gastos;
  const existingIndex = gastos.indexOf(data);
  if (existingIndex === -1) {
    gastos.push(data);
  } else {
    gastos[existingIndex] = { ...data }; // ensure reactivity
  }
  const index = listaEventos.indexOf(dataEvento.value)
  if (index !== -1) {
    // replace entire event to trigger watchers
    listaEventos[index] = { ...dataEvento.value }
  }
}
const gestionEvento = (data = null) => {
  dataEvento.value = data
  return gestion.value = !gestion.value
}
const eliminarEvento = (data) => {
  if (confirm('¿Estás seguro de eliminar este gasto?')) {
    const index = listaEventos.indexOf(data)
    if (index !== -1) {
      listaEventos.splice(index, 1)
      alert.message('Gasto eliminado con éxito')
    }
  }
}

// Inicio del programa
onMounted(() => {
  if (localStorage.getItem('listaEventos')) {
    listaEventos.push(...JSON.parse(localStorage.getItem('listaEventos')))
  }
})

watch(listaEventos, () => {
  localStorage.setItem('listaEventos', JSON.stringify(listaEventos))
}, { deep: true })

</script>

<template>
  <Modal 
    v-if="modal"
    @state-modal="stateModal"
    @tomar-data="tomarData"
  />
  
  <div 
    class="bg-(--rosa) min-h-screen"
  >
    <Cabecera 
      :class="
          {'fixed left-0 top-0': modal === false}
        "
    />
    <SectionEvento 
      v-if="gestion"
      :data="dataEvento"
      @gestion-evento="gestionEvento"
      @guardar-gasto="guardarGasto"
    />
    <div v-if="!gestion">
      <div
        class="flex-col grid grid-cols-2 lg:grid-cols-4 md:flex-row justify-evenly gap-4 items-center p-5 md:p-10"
        :class="
          {' mt-19': modal === false}
        "
      >
        <div
          v-for="item in cabecera"
          :key="item.titulo"
          class="gap-4 bg-gray-100 w-full h-50 cont-secundary rounded-xl"
        >
          <DatosCabecera 
            :titulo="item.titulo" 
            :icono="item.icono"  
            :monto="item.valor"
            :texto = "item.text"
            :porcentaje="item.porcentaje"
            :barra = "item.showBar"
          />
        </div>
      </div>
      <BarraIntermedia @state-modal="stateModal" :modal="modal"/>
      <div 
        class="grid w-full grid-cols-1 md:grid-cols-3 gap-4 p-5 md:p-10"
      >
        <div 
          v-for="(item, index) in listaEventos"
          :key="index" 
          class="bg-gray-100 w-full h-56 cont-secundary rounded-2xl hover:bg-gray-50  transition-all duration-300 ease-in-out"
        >
          <EventosCard 
            :evento="item"
            @gestion-evento="gestionEvento"
            @eliminar-evento="eliminarEvento"
          />
        </div>
      </div>
    </div>
    
  </div>
  
</template>

