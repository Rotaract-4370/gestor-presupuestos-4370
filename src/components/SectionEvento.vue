<script setup>
  import {computed, ref} from 'vue'
  import useFormatCadena from '../composables/useFormatoMoneda'
  import List from './UI/List.vue';
  import ModalGastos from './UI/Modal/ModalGastos.vue';
  import { estiloCategoria } from '../helpers/Config';
  import DatosEventos from './DatosEventos.vue';
  import BarraInicioEvento from './BarraInicioEvento.vue';

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
  const eliminarGasto = (index) => {
  if (confirm('¿Estás seguro de eliminar este gasto?')) {
    props.data.gastos.splice(index, 1) 
    alert.message('Gasto eliminado con éxito')
  }
}

</script>

<template>
  <ModalGastos 
    v-if="modal" 
    :gasto="gastoEditar"
    @state-modal="stateModal" 
    @tomar-data="(data) => handleGasto(data)" 
  />
  <div class="py-25 px-5 md:px-10 w-full flex flex-col justify-center items-center gap-7">
    <BarraInicioEvento 
      @gestion-evento="emit('gestion-evento')"
      :data="props.data"
      :gastadoEvento="gastadoEvento"
    />

    <!--  -->
    <div class="grid grid-cols-2 md:grid-cols-3 w-full gap-4 md:gap-6">
      <DatosEventos
        :data="props.data"
        :gastadoEvento="gastadoEvento"
      />
    </div>
    <!--  -->
    <div class="flex flex-col md:flex-row gap-4 w-full">
      <div
        class="overflow-x-auto bg-white px-6 py-5 rounded-2xl w-full md:w-[65%] shadow-sm flex flex-col cont-secundary justify-between border border-gray-100"
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
              @eliminar-gasto="eliminarGasto"
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
