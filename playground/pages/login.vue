<script setup lang="ts">
import {
  definePageMeta,
  useLang,
  useHead,
  computed,
  useMenuItems,
} from "#imports";

definePageMeta({
  syscode: "login",
  title: "$.login.title",
  label: "$.login.label",
});

const { t } = useLang();
const { route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.login.description") },
    { name: "keywords", content: t("$.login.keywords") },
  ],
});
</script>

<template>
  <div class="flex items-center justify-center mt-10">
    <CmpLogin :ui="{ root: 'w-[600px]' }" />
  </div>
</template>
