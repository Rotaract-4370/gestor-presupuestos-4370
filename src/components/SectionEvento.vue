<script setup>
  import {computed, ref} from 'vue'
  import Boton from './UI/Boton.vue';
  import { titulosEventos } from '../helpers/Config';
  import useFormatCadena from '../composables/useFormatoMoneda'
  import List from './UI/List.vue';
  import ModalGastos from './UI/Modal/ModalGastos.vue';
  import { estiloCategoria } from '../helpers/Config';

  const { formatearCadena } = useFormatCadena()

  const modal = ref(false);
  const props = defineProps({
    data: {type: Object, default: () => ({})},
  })
  const emit = defineEmits(['gestion-evento', 'guardar-gasto'])

  // editing state
  const gastoEditar = ref(null);
  const isEditing = ref(false);

  const stateModal = () => {
    // when opening fresh modal, clear editing flags
    if (!modal.value) {
      gastoEditar.value = null;
      isEditing.value = false;
    }
    return modal.value = !modal.value
  }
  const gastadoEvento = computed(() => {
    return props.data.gastos?.reduce((acc, g) => acc + (Number(g.monto) || 0), 0) || 0
  })
  const resumenCategorias = computed(() => {
    const map = {};
    props.data.gastos?.forEach(g => {
      const cat = g.categoria || 'Sin categoria';
      const monto = Number(g.monto) || 0;
      map[cat] = (map[cat] || 0) + monto;
    });
    return Object.entries(map)
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total);
  })

  const handleGasto = (data) => {
    if (isEditing.value && gastoEditar.value) {
      // update existing object
      Object.assign(gastoEditar.value, data);
    } else {
      props.data.gastos.push(data);
    }
    // notify parent so it can sync/listen
    emit('guardar-gasto', data);
    // reset modal state
    modal.value = false;
    isEditing.value = false;
    gastoEditar.value = null;
  }

  const editarGasto = (data) => {
    // open modal prefilled
    gastoEditar.value = data;
    isEditing.value = true;
    modal.value = true;
  }

</script>

<template>
  <ModalGastos 
    v-if="modal" 
    :gasto="gastoEditar"
    @state-modal="stateModal" 
    @tomar-data="(data) => handleGasto(data)" 
  />
  <div class="py-25 px-10 w-full flex flex-col justify-center items-center gap-7">
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
            text-4xl text-white bi bi-arrow-left-short
          "
        ></i>
        <div
          class="flex flex-col justify-start"
        >
          <p 
            class="text-xl capitalize poppins-normal text-white"
          >{{ props.data.nombre }}</p>
          <p
            class="text-ms capitalize poppins-normal text-white/50"
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
    <!--  -->
    <div class="grid grid-cols-1 md:grid-cols-3 w-full gap-6">
      <div
        v-for="(item, index) in titulosEventos"
        :key="index"
        class="bg-white px-6 py-5 h-44 rounded-2xl cont-secundary shadow-sm flex flex-col justify-between border border-gray-100"
      >
        <div class="flex flex-row w-full justify-between items-center">
          <p class="text-gray-600 font-medium uppercase text-xs tracking-wider">
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
            <p class="text-2xl poppins-normal text-gray-700">
              {{formatearCadena(gastadoEvento)}}
            </p>
            <p 
              class="text-[12px] text-gray-600 mt-1 uppercase"
              :class="{'text-red-600' : (gastadoEvento / props.data.presupuesto) * 100 > 80,
                'text-green-600' : (gastadoEvento / props.data.presupuesto) * 100 < 80 && (gastadoEvento / props.data.presupuesto) * 100 > 0
              }"
            >
              {{ ((gastadoEvento / props.data.presupuesto) * 100) }}% consumido
            </p>
          </div>
          
          <div 
            v-if="item.nombre === 'Restante'"
            class="flex flex-row w-full justify-between items-center"
            :class="(props.data.presupuesto - gastadoEvento) < 0 ? 'text-red-500' : 'text-green-600'"
          >
            <p class="text-2xl poppins-normal">
              {{formatearCadena(props.data.presupuesto - gastadoEvento)}}
            </p>
            <p 
              v-if="item.nombre === 'Restante'"
              class="text-xs font-medium"
            >
              {{ (props.data.presupuesto - gastadoEvento) < 0 ? 'Presupuesto excedido' : 'Disponible' }}
            </p>
          </div>
         
        </div>
      </div>
    </div>
    <!--  -->
    <div class="flex flex-col md:flex-row gap-4 w-full">
      <div
        class="bg-white px-6 py-5 rounded-2xl w-full md:w-[65%] shadow-sm flex flex-col cont-secundary justify-between border border-gray-100"
      >

        <p class="text-ms poppins-normal text-gray-600 mb-10">Detalles de Gastos</p>
        <div class="flex gap-2 items-center mb-3">
          <label class="poppins-normal text-sm">Buscar por nombre:</label>
          <input 
            type="text" placeholder="Buscar..."
            class="border-2 border-gray-400 px-2 py-1 rounded-md poppins-normal text-sm text-gray-700"
          />
        </div>
        

        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" class="p-2 text-left text-sm font-extrabold poppins-normal text-gray-600">
                Nombre
              </th>
              <th scope="col" class="p-2 text-left text-sm font-extrabold poppins-normal text-gray-600">
                Categoria
              </th>
              <th scope="col" class="p-2 text-left text-sm font-extrabold poppins-normal text-gray-600">
                Fecha
              </th>
              <th scope="col" class="p-2 text-left text-sm font-extrabold poppins-normal text-gray-600">
                Monto
              </th>
              <th scope="col" class="p-2 text-left text-sm font-extrabold poppins-normal text-gray-600">
                Accion
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white h-auto">
            <!-- componente -->
            <List 
              v-for="(item, index) in props.data.gastos"
              :key="index"
              :gasto="item"
              @editar-gasto="editarGasto"
              @eliminar-gasto="() => props.data.gastos.splice(index, 1)"
            />
          </tbody>
        </table>
      <!-- --------------------------- -->
      </div>
      <div
        class="bg-white hidden md:block px-6 cont-secundary w-[35%] h-50 py-5 rounded-2xl shadow-sm flex-col justify-between border border-gray-100"
      >
        <p class="font-medium text-gray-600 mb-3">Resumen por Categoria</p>
        <ul class="space-y-2 text-sm">
          <li v-if="resumenCategorias.length === 0" class="text-gray-500">No hay gastos registrados</li>
          <li 
            v-for="(r, idx) in resumenCategorias" 
            :key="idx" 
            class="
              flex justify-between
            "
          >
            <span :class="estiloCategoria(r.categoria)" >{{ r.categoria }}</span>
            <span>{{ formatearCadena(r.total) }}</span>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
</template>
