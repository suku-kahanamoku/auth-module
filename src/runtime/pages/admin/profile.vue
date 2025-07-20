<script setup lang="ts">
import {
  definePageMeta,
  useLang,
  useHead,
  computed,
  useMenuItems,
} from "#imports";

definePageMeta({
  syscode: "profile",
  title: "$.profile.title",
});

const { t } = useLang();
const { route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.profile.description") },
    { name: "keywords", content: t("$.profile.keywords") },
  ],
});
</script>

<template>
  <div class="w-full mx-auto px-5 py-5 flex flex-col gap-10">
    <div class="w-full h-full flex justify-center items-center">
      {{ title }}
    </div>
  </div>
</template>
