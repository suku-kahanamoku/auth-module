<script setup lang="ts">
import {
  definePageMeta,
  useLang,
  useHead,
  computed,
  useMenuItems,
} from "#imports";

definePageMeta({
  syscode: "forgot-password",
  title: "$.forgot_password.title",
});

const { t } = useLang();
const { route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.forgot_password.description") },
    { name: "keywords", content: t("$.forgot_password.keywords") },
  ],
});
</script>

<template>
  <div class="flex w-full">
    <div class="flex items-center justify-center mx-auto w-full">
      <CmpForgotPassword />
    </div>
  </div>
</template>
