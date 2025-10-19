<script setup lang="ts">
const localePath = useLocalePath();

const menuItems = [
  {
    label: "$.navbar.about",
    to: "/#about",
  },
  {
    label: "$.navbar.contact",
    to: "/#contact",
  },
];
const isOpen = ref(false);
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <CmpHeader />

    <CmpSlideMenu
      v-model:is-open="isOpen"
      :menu-items="menuItems"
      :config="{ side: 'right', ui: { title: 'h-8' } }"
    >
      <template #logo> Logo </template>
    </CmpSlideMenu>

    <main>
      <slot></slot>
    </main>

    <CmpFooter url="https://www.prasentace.cz/" name="PRASENTACE" />
  </div>
</template>
