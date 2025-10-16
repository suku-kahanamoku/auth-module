<script lang="ts" setup>
import type { DropdownMenuItem } from "#ui/types";
import { useUserSession } from "#imports";

const props = defineProps<{
  menuItems?: DropdownMenuItem[][];
}>();

const userSessionStore = useUserSession();
</script>

<template>
  <div class="flex">
    <UDropdown
      v-if="userSessionStore?.loggedIn"
      :items="menuItems"
      :popper="{ placement: 'bottom-start' }"
    >
      <div data-testid="user-avatar" class="flex">
        <UAvatar
          v-if="userSessionStore?.user?.picture"
          :src="userSessionStore?.user?.picture"
          aria-label="avatar"
          alt="avatar"
        />
        <UAvatar
          v-else
          icon="i-heroicons-user"
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
