<script setup lang="ts">
import {
  definePageMeta,
  useLang,
  useHead,
  computed,
  useMenuItems,
} from "#imports";

definePageMeta({
  syscode: "pz",
  title: "$.pz.title",
});

const { t } = useLang();
const { route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.pz.description") },
    { name: "keywords", content: t("$.pz.keywords") },
  ],
});
</script>

<template>
  <div class="flex w-full">
    <div class="flex items-center justify-center mx-auto w-full">
      {{ title }}
    </div>
  </div>
</template>
