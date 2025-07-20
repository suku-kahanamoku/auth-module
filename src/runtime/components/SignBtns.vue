<script lang="ts" setup>
import { useMenuItems, useLocalePath, useAuthStore } from "#imports";

const { routes } = useMenuItems();
const localePath = useLocalePath();
const authStore = useAuthStore();
</script>

<template>
  <div v-if="!authStore?.loggedIn">
    <UButton
      v-if="routes?.login?.path"
      data-testid="menu-login"
      :to="localePath(routes?.login?.path)"
      class="text-secondary-500 dark:text-secondary-400"
      variant="outline"
      active-class="hidden"
    >
      {{
        $tt(
          (routes?.login?.meta?.label || routes?.login?.meta?.title) as string
        )
      }}
    </UButton>
    <UButton
      v-if="routes?.signup?.path"
      data-testid="menu-signup"
      :to="localePath(routes?.signup?.path)"
      active-class="hidden"
    >
      {{
        $tt(
          (routes?.signup?.meta?.label || routes?.signup?.meta?.title) as string
        )
      }}
    </UButton>
  </div>
</template>
