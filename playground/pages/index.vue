<template>
  fdsa
    <div>{{ user }}</div>
  <UButton @click="fetch">fdsa</UButton>
</template>

<script setup lang="ts">
const { user, fetch } = useUserSession();
</script>
