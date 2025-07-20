<script lang="ts" setup>
import type { DropdownMenuItem } from "#ui/types";
import { useAuthStore } from "#imports";

const props = defineProps<{
  menuItems?: DropdownMenuItem[][];
}>();

const authStore = useAuthStore();
</script>

<template>
  <div class="flex">
    <UDropdown
      v-if="authStore?.loggedIn"
      :items="menuItems"
      :popper="{ placement: 'bottom-start' }"
    >
      <div data-testid="user-avatar" class="flex">
        <UAvatar
          v-if="authStore?.user?.picture"
          :src="authStore?.user?.picture"
          aria-label="avatar"
          alt="avatar"
        />
        <UAvatar
          v-else
          icon="i-heroicons-user"
          :chip-text="authStore?.initials"
          chip-position="top-right"
          chip-color="secondary"
          aria-label="avatar"
          alt="avatar"
        />
      </div>

      <template #item="{ item }">
        <span class="truncate" :data-testid="`user-avatar-${item.syscode}`">{{
          $tt(item.label)
        }}</span>
      </template>
    </UDropdown>

    <!-- jinak zobrazi login a signup menu -->
    <CmpSignBtns v-else class="hidden lg:flex items-center gap-4" />
  </div>
</template>
