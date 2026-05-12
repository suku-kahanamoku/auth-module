<script setup lang="ts">
import { ref } from "vue";
import {
  useToastify,
  useLocalePath,
  useMenuItems,
  navigateTo,
  useUserSession,
  useRuntimeConfig,
} from "#imports";
import defu from "defu";

import type { IFormField } from "@suku-kahanamoku/form-module/types";

import sConfig from "../assets/configs/signup.json";

// Definice props
const props = defineProps<{
  ui?: Record<string, any>;
  config?: Record<string, any>;
}>();

const localePath = useLocalePath();
const { routes } = useMenuItems();
const { display } = useToastify();
const { fetch } = useUserSession();
const loading = ref();
const runtimeConfig = useRuntimeConfig().public?.authModule as any;
const protectedPages = runtimeConfig.protectedPages || [];

const activeConfig = computed(() => props.config ?? sConfig);

async function onSubmit(body: Record<string, any>) {
  if (activeConfig.value?.restUrl) {
    loading.value = true;
    try {
      await $fetch(activeConfig.value.restUrl, { method: "POST", body });
      await fetch();
      await navigateTo(localePath(protectedPages[0] || "/"));
    } catch (error: any) {
      display({ type: "error", message: error.data.message });
    }
    loading.value = false;
  }
}
</script>
<template>
  <CmpForm
    :fields="(activeConfig?.fields as IFormField[])"
    variant="subtle"
    :ui="defu(ui, { header: 'space-y-4' })"
    @submit="onSubmit"
  >
    <template #header>
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt("$.signup.title") }}
      </h1>
    </template>

    <template #terms="{ field, model }">
      <div class="flex items-center justify-between">
        <CmpField v-model="model[field.name]" :field="field">
          <template #label>
            <span> {{ $tt("$.signup.accept_condition") }} </span>&nbsp;<ULink
              data-testid="terms-conditions"
              :to="localePath(routes['terms-conditions']?.path!)"
              class="text-primary-500 hover:underline"
            >
              {{
                $tt(
                  routes["terms-conditions"]?.meta?.title as string
                )?.toLocaleLowerCase()
              }}
            </ULink>
          </template>
        </CmpField>
      </div>
    </template>
    <template #actions>
      <div class="w-full flex flex-col gap-4">
        <UButton
          data-testid="signup-submit"
          type="submit"
          size="lg"
          block
          :loading="loading"
        >
          {{ $tt("$.signup.title") }}
        </UButton>
        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
          {{ $tt("$.signup.has_account") }}
          <ULink
            data-testid="login"
            :to="localePath(routes.login?.path!)"
            class="font-medium text-primary-500"
            >{{ $tt(routes.login?.meta?.title as string) }}</ULink
          >
        </p>
      </div>
    </template>
  </CmpForm>
</template>
