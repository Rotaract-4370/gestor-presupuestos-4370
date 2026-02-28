<script setup>
  const props = defineProps({
    color: {type: String, default: 'bg-blue-600 text-white hover:bg-blue-500'},
    icono: {type: String, default: ''}
  })
</script>

<template>
  <div
    class="
      py-2 px-4 md:text-ms text-[13px] rounded-xl flex justify-center items-center
      transition-all duration-300 active:scale-95 active:duration-initial disabled:cursor-not-allowed
      cursor-pointer
    "
    :class="`${props.color} ${props.icono ? 'gap-3' : ''}`"
  >
    <i :class=props.icono class="text-xl hidden md:block text-white text-bold" ></i>
    <slot></slot>
  </div>
</template>
