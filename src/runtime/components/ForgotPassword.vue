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
  <div
    class="w-full border border-gray-200 rounded-lg shadow-md dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-6 space-y-4">
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt("$.forgot_password.title") }}
      </h1>
      <p class="font-light text-gray-500 dark:text-gray-400">
        {{ $tt("$.forgot_password.description") }}
      </p>
      <CmpForm
        :fields="(config?.fields as IFormField[])"
        variant="soft"
        @submit="onSubmit"
      >
        <template #actions>
          <UButton
            data-testid="forgot-password-submit"
            type="submit"
            :loading="loading"
          >
            {{ $tt("$.btn.submit") }}
          </UButton>
        </template>
      </CmpForm>
    </div>
  </div>
</template>
