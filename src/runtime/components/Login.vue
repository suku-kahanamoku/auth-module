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

import lConfig from "../assets/configs/login.json";

const { updateConfig } = useUrlResolver();
const localePath = useLocalePath();
const { route, routes } = useMenuItems();
const { loginByGoogle, loginByLinkedin, login } = useAuthStore();
const { display } = useToastify();
const loading = ref();

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(lConfig);
      updateConfig(route, result);
      return result as typeof lConfig;
    } catch (error: any) {
      return {} as typeof lConfig;
    }
  },
  { watch: [() => route.query] }
);

async function onSubmit(event: Record<string, any>) {
  loading.value = true;
  try {
    await login(event);
  } catch (error: any) {
    display({ type: "error", message: error.data.message });
  }
  loading.value = false;
}
</script>
<template>
  <div
    class="w-full border border-gray-200 rounded-lg shadow-md dark:border max-w-md dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ $tt("$.login.title") }}
      </h1>

      <div class="flex justify-between items-center w-full gap-4">
        <UButton
          data-testid="login-google"
          variant="outline"
          size="lg"
          class="flex-1"
          @click="loginByGoogle()"
        >
          <div class="flex items-center justify-center gap-2 mx-auto">
            <Icon name="logos:google-icon" size="20" />
            Google
          </div>
        </UButton>
        <UButton
          data-testid="login-linkedin"
          variant="outline"
          size="lg"
          class="flex-1"
          @click="loginByLinkedin()"
        >
          <div class="flex items-center justify-center gap-2 mx-auto">
            <Icon name="logos:linkedin-icon" size="20" />
            LinkedIn
          </div>
        </UButton>
      </div>

      <USeparator :label="$tt('$.login.or')" />

      <CmpForm
        :fields="(config?.fields as IFormField[])"
        variant="soft"
        @submit="onSubmit"
      >
        <template #remember="{ field, model }">
          <div class="flex items-center justify-between">
            <CmpField v-model="model[field.name]" :field="field" class="flex" />
            <ULink
              data-testid="forgot-password"
              :to="localePath(routes['forgot-password']?.path)"
              class="text-sm font-medium text-primary-500"
            >
              {{ $tt(routes["forgot-password"]?.meta?.title as string) }}
            </ULink>
          </div>
        </template>

        <template #actions>
          <div class="flex flex-col gap-4">
            <UButton
              data-testid="login-submit"
              type="submit"
              size="lg"
              block
              :loading="loading"
            >
              {{ $tt("$.login.signin") }}
            </UButton>

            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              {{ $tt("$.login.no_account") }}
              <ULink
                data-testid="signup"
                :to="localePath(routes?.signup?.path)"
                class="font-medium text-primary-500"
              >
                {{ $tt(routes?.signup?.meta?.title as string) }}
              </ULink>
            </p>
          </div>
        </template>
      </CmpForm>
    </div>
  </div>
</template>
