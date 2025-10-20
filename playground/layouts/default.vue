<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <CmpHeader />

  <UMain>
    <slot></slot>
  </UMain>

  <CmpFooter url="https://www.prasentace.cz/" name="PRASENTACE" />
</template>
