<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <CmpHeader />

  <UMain>
    <slot></slot>
  </UMain>
</template>
