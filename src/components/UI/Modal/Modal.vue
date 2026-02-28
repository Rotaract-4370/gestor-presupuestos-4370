<script setup>
  import { ref } from 'vue';
  import Boton from '../Boton.vue';
  import useAlerta from '../../../composables/useAlerta'

  const emit = defineEmits(['stateModal', 'tomarData']);
  const { alerta, tipoAlerta } = useAlerta();

  const nuevoEvento = ref({
    nombre: '',
    fecha: '',
    presupuesto: null
  });

  const enviarDatos = () => {
    if (Object.values(nuevoEvento.value).some(value => !value)) return tipoAlerta('Campos vacios')
    if (nuevoEvento.value.presupuesto < 50) return tipoAlerta('El presupuesto debe ser mayor a $50')
    
    emit('tomarData', { ...nuevoEvento.value });
    emit('stateModal');
  };

</script>

<template>
  <div 
    class="bg-black/50 fixed top-0 left-0 w-full min-h-screen flex justify-center items-center"
  >
    <div
      class="relative w-1/3 h-auto gap-4 p-10 bg-white rounded-xl flex flex-col"
    >
      <i 
        @click="$emit('stateModal')"
        class="absolute top-2 right-3 bi bi-x-lg"
      ></i>

      <div>
        <p
        class="text-xl text-shadow-gray-900 font-semibold"
        >Nuevo Evento</p>
        <span
          class="text-sm text-gray-500 font-normal"
        >Ingresa los datos del Evento</span>
      </div>

      <form @submit.prevent="enviarDatos"
        class="flex flex-col gap-4"
      >
        <div
          class="flex flex-col gap-1 text-sm text-gray-900"
        >
          <label for="event-name"
            class="font-semibold"
          >Nombre del Evento</label>
          <input 
            type="text"
            id="event-name"
            v-model="nuevoEvento.nombre"
            placeholder="Ej. Visita Comunitaria"
            class="py-2 px-4 rounded-md border-2 border-gray-200 w-full" 
            :class="{'border-red-500/70' : alerta.msj}"
          />
        </div>
        
        <div
          class="flex flex-col gap-1 text-sm text-gray-900"
        >
          <label for="event-date"
            class="font-semibold"
          >Fecha del Evento</label>
          <input 
            type="date"
            id="event-date"
            v-model="nuevoEvento.fecha"
            class="py-2 px-4 rounded-md border-2 border-gray-200 w-full " 
            :class="{'border-red-500/70' : alerta.msj}"
          />
        </div>
        
        <div
          class="flex flex-col gap-1 text-sm text-gray-900"
        >
          <label for="event-presupuesto"
            class="font-semibold"
          >Presupuesto del Evento ($)</label>
          <input 
            type="number"
            id="event-presupuesto"
            placeholder="500"
            v-model="nuevoEvento.presupuesto"
            class="py-2 px-4 rounded-md border-2 border-gray-200 w-full"
            :class="{'border-red-500/70' : alerta.msj} "
          />
        </div>
      </form>

      <p class="text-center text-red-500/70">{{ alerta.msj }}</p>

      <div
        class="flex flex-row items-center justify-end gap-3"
      >
        <Boton
          @click="$emit('stateModal')"
          color="bg-gray-200 text-gray-900 hover:bg-gray-300"
        >Cancelar</Boton>
        <Boton
          @click="enviarDatos"
        >Guardar</Boton>
      </div>

    </div>
  </div>
</template>
