<script setup lang="ts">
import {
  useAuthStore,
  useToastify,
  ref,
  useUrlResolver,
  useAsyncData,
  useLocalePath,
  useMenuItems,
} from "#imports";

import { CLONE } from "@suku-kahanamoku/common-module/utils";
import type { IFormField } from "@suku-kahanamoku/form-module/types";

import sConfig from "../assets/configs/signup.json";

const { updateConfig } = useUrlResolver();
const localePath = useLocalePath();
const { route, routes } = useMenuItems();
const { signup } = useAuthStore();
const { display } = useToastify();
const loading = ref();

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(sConfig);
      updateConfig(route, result);
      return result as typeof sConfig;
    } catch (error: any) {
      return {} as typeof sConfig;
    }
  },
  { watch: [() => route.query] }
);

async function onSubmit(event: Record<string, any>) {
  loading.value = true;
  try {
    await signup(event);
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
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt("$.signup.title") }}
      </h1>

      <CmpForm
        :fields="(config?.fields as IFormField[])"
        variant="soft"
        @submit="onSubmit"
      >
        <template #terms="{ field, model }">
          <div class="flex items-center justify-between">
            <CmpField v-model="model[field.name]" :field="field">
              <template #label>
                <span> {{ $tt("$.signup.accept_condition") }} </span
                >&nbsp;<ULink
                  data-testid="terms-conditions"
                  :to="localePath(routes['terms-conditions']?.path)"
                  class="text-primary-500"
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
          <div class="flex flex-col gap-4">
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
                :to="localePath(routes?.login?.path)"
                class="font-medium text-primary-500"
                >{{ $tt(routes?.login?.meta?.title as string) }}</ULink
              >
            </p>
          </div>
        </template>
      </CmpForm>
    </div>
  </div>
</template>
