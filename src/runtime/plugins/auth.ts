import {
  defineNuxtPlugin,
  navigateTo,
  useLang,
  useLocalePath,
  useMenuItems,
  useRuntimeConfig,
  useUserSession,
} from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  const localePath = useLocalePath();
  const {
    i18n: { locale },
  } = useLang();
  const { routes, router } = useMenuItems();
  const { loggedIn, fetch } = useUserSession();
  const config = useRuntimeConfig().public?.authModule as any;
  const protectedPages = config.protectedPages || [];

  // Aktualizace session pred kazdou navigaci
  router.beforeEach(async (to, from) => await fetch());

  // Pokud uzivatel prepina mezi tabami v prohlizeci
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
      await fetch();
      // Kontrola, zda je uzivatel prihlasen a zda se pokousi navigovat na chranenou stranku
      if (
        !loggedIn.value &&
        protectedPages.some(
          (page: string) =>
            router.currentRoute.value.path.startsWith(page) ||
            router.currentRoute.value.path.startsWith(`/${locale.value + page}`)
        )
      ) {
        await navigateTo(localePath(routes.login?.path!), {
          redirectCode: 302,
        });
      }
    }
  });
});
