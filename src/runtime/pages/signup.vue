<script setup lang="ts">
import { CmpSignup } from "#components";
import {
  definePageMeta,
  useLang,
  useHead,
  computed,
  useMenuItems,
} from "#imports";

definePageMeta({
  syscode: "signup",
  title: "$.signup.title",
  label: "$.signup.label",
});

const { t } = useLang();
const { route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.signup.description") },
    { name: "keywords", content: t("$.signup.keywords") },
  ],
});
</script>

<template>
  <div class="flex items-center justify-center mt-10">
    <CmpSignup />
  </div>
</template>
