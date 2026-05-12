<script setup lang="ts">
import { ref, computed } from "vue";
import {
  useToastify,
} from "#imports";
import defu from "defu";

import { ITERATE } from "@suku-kahanamoku/common-module/utils";
import type { IFormField } from "@suku-kahanamoku/form-module/types";

import fConfig from "../assets/configs/forgot_password.json";

// Definice props
const props = defineProps<{
  ui?: Record<string, any>;
  config?: Record<string, any>;
}>();

const { display } = useToastify();
const loading = ref();

const activeConfig = computed(() => props.config ?? fConfig);

async function onSubmit(body: Record<string, any>) {
  if (activeConfig.value?.restUrl) {
    loading.value = true;

    try {
      await $fetch(activeConfig.value.restUrl, { method: "POST", body });
      // reset formulare
      ITERATE(body, (v, k) => (body[k] = undefined));
      display({ type: "success", message: "$.forgot_password.success_msg" });
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
