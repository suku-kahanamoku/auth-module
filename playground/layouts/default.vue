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
    <CmpMainMenu v-model:is-open="isOpen" :config="{}" :menu-items="menuItems">
      <template #logo>
        <ULink :to="localePath('/')" class="h-full"> Logo </ULink>
      </template>
    </CmpMainMenu>

    <CmpSlideMenu
      v-model:is-open="isOpen"
      :menu-items="menuItems"
      :config="{ side: 'right', ui: { title: 'h-8' } }"
    >
      <template #logo> Logo </template>
    </CmpSlideMenu>

    <main>
      <UButton
      :to="localePath('/neco')"
      >
fdsa
      </UButton>
      <slot></slot>
    </main>

    <CmpFooter url="https://www.prasentace.cz/" name="PRASENTACE" />
  </div>
</template>
