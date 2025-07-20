<script setup lang="ts">
import {
  definePageMeta,
  useLang,
  useHead,
  computed,
  useMenuItems,
} from "#imports";

definePageMeta({
  syscode: "terms-conditions",
  title: "$.terms_conditions.title",
});

const { t } = useLang();
const { route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.terms_conditions.description") },
    { name: "keywords", content: t("$.terms_conditions.keywords") },
  ],
});
</script>

<template>todo</template>
