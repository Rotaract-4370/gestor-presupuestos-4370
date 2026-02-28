<script setup>
  import { reactive, watch } from 'vue';
  import Boton from '../Boton.vue';
  import useAlerta from '../../../composables/useAlerta'

  const { alerta, tipoAlerta } = useAlerta();

  const categorias = ['Compra', 'Servicios', 'Comida', 'Otros']
  const emit = defineEmits(['state-modal', 'tomar-data']);
  const props = defineProps({
    gasto: { type: Object, default: null }
  });

  const nuevoGasto = reactive({
    nombre: '',
    categoria: '',
    fecha: '',
    monto: 0 
  });

  // whenever gasto prop is provided (editing), fill form
  watch(
    () => props.gasto,
    (g) => {
      if (g) {
        nuevoGasto.nombre = g.nombre || '';
        nuevoGasto.categoria = g.categoria || '';
        nuevoGasto.fecha = g.fecha || '';
        nuevoGasto.monto = g.monto || 0;
      } else {
        // reset for new
        nuevoGasto.nombre = '';
        nuevoGasto.categoria = '';
        nuevoGasto.fecha = '';
        nuevoGasto.monto = 0;
      }
    },
    { immediate: true }
  );

  const enviarDatos = () => {
    // Corregido: Usamos nuevoGasto (sin .value)
    if (Object.values(nuevoGasto).some(value => !value)) return tipoAlerta('Campos vacios')
    if (nuevoGasto.monto === 0) return tipoAlerta('El presupuesto debe ser mayor a $0')
    
    if (props.gasto) {
      // aactualizar gasto existente
      props.gasto.nombre = nuevoGasto.nombre;
      props.gasto.categoria = nuevoGasto.categoria;
      props.gasto.fecha = nuevoGasto.fecha;
      props.gasto.monto = nuevoGasto.monto;
      emit('state-modal');
    } else {
      // agregar nuevo gasto
      emit('tomar-data', { ...nuevoGasto });
      emit('state-modal');
    }
  }
</script>

<template>
  <div class="bg-black/50 fixed top-0 left-0 w-full min-h-screen flex justify-center items-center z-50">
    <div class="relative md:w-2/3 w-5/6 gap-4 p-10 bg-white rounded-xl flex flex-col shadow-2xl">
      
      <i @click="emit('state-modal')" class="absolute top-4 right-4 bi bi-x-lg cursor-pointer"></i>

      <div>
        <p class="text-xl font-semibold text-gray-900">{{ props.gasto ? 'Editar Gasto' : 'Nuevo Gasto' }}</p>
        <span class="text-sm text-gray-500">Ingresa los datos del Gasto</span>
      </div>

      <form @submit.prevent="enviarDatos" class="flex flex-col gap-4">
        
        <div class="flex flex-col gap-1 text-sm text-gray-900">
          <label class="font-semibold">Nombre del Gasto</label>
          <input 
            type="text"
            v-model="nuevoGasto.nombre"
            placeholder="Ej. Refrigerios del Equipo"
            class="py-2 px-4 rounded-md border-2 border-gray-200 w-full focus:border-blue-500 outline-none" 
            :class="{'border-red-500' : alerta.msj && !nuevoGasto.nombre}"
          />
        </div>

        <div class="flex flex-col gap-1 text-sm text-gray-900">
          <label class="font-semibold">Categoría del Gasto</label>
          <select 
            v-model="nuevoGasto.categoria"
            class="py-2 px-4 rounded-md border-2 border-gray-200 w-full bg-white focus:border-blue-500 outline-none"
            :class="{'border-red-500' : alerta.msj && !nuevoGasto.categoria}"
          >
            <option value="" disabled>-- Seleccione una categoría --</option>
            <option v-for="cat in categorias" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        
        <div class="flex flex-col gap-1 text-sm text-gray-900">
          <label class="font-semibold">Fecha del Gasto</label>
          <input 
            type="date"
            v-model="nuevoGasto.fecha"
            class="py-2 px-4 rounded-md border-2 border-gray-200 w-full" 
            :class="{'border-red-500' : alerta.msj && !nuevoGasto.fecha}"
          />
        </div>
        
        <div class="flex flex-col gap-1 text-sm text-gray-900">
          <label class="font-semibold">Monto del Gasto ($)</label>
          <input 
            type="number"
            placeholder="0.00"
            v-model.number="nuevoGasto.monto"
            class="py-2 px-4 rounded-md border-2 border-gray-200 w-full"
            :class="{'border-red-500' : alerta.msj && nuevoGasto.monto <= 0}"
          />
        </div>
      </form>

      <p v-if="alerta.msj" class="text-center text-red-500 text-sm font-medium">{{ alerta.msj }}</p>

      <div class="flex flex-row items-center justify-end gap-3 mt-4">
        <Boton @click="emit('state-modal')" color="bg-gray-200 text-gray-900 hover:bg-gray-300">
          Cancelar
        </Boton>
        <Boton @click="enviarDatos" color="bg-blue-600 text-white hover:bg-blue-700">
          {{ props.gasto ? 'Editar Gasto' : 'Agregar Gasto' }}
        </Boton>
      </div>
    </div>
  </div>
</template>
