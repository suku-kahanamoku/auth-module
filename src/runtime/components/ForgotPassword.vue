<script setup lang="ts">
import {
  useToastify,
  ref,
  useUrlResolver,
  useAsyncData,
  useLocalePath,
  useMenuItems,
} from "#imports";

import { CLONE, ITERATE } from "@suku-kahanamoku/common-module/utils";
import type { IFormField } from "@suku-kahanamoku/form-module/types";

import fConfig from "../assets/configs/forgot_password.json";

const { updateConfig } = useUrlResolver();
const { route } = useMenuItems();
const { display } = useToastify();
const loading = ref();

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(fConfig);
      updateConfig(route, result);
      return result as typeof fConfig;
    } catch (error: any) {
      return {} as typeof fConfig;
    }
  },
  { watch: [() => route.query] }
);

async function onSubmit(body: Record<string, any>) {
  loading.value = true;
  try {
    await $fetch("/api/auth/reset-password", { method: "POST", body });
    // reset formulare
    ITERATE(body, (v, k) => (body[k] = undefined));
    display({ type: "success", message: "$.forgot_password.success_msg" });
  } catch (error: any) {
    display({ type: "error", message: error.data.message });
  }
  loading.value = false;
}
</script>
<template>
  <CmpForm
    :fields="(config?.fields as IFormField[])"
    variant="subtle"
    :ui="{ root: 'w-[400px]', header: 'space-y-4' }"
    @submit="onSubmit"
  >
    <template #header>
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt("$.forgot_password.title") }}
      </h1>
      <p class="font-light text-gray-500 dark:text-gray-400">
        {{ $tt("$.forgot_password.description") }}
      </p>
    </template>

    <template #actions>
      <UButton
        data-testid="forgot-password-submit"
        type="submit"
        block
        :loading="loading"
      >
        {{ $tt("$.btn.submit") }}
      </UButton>
    </template>
  </CmpForm>
</template>
