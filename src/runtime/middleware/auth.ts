import {
  useLocalePath,
  navigateTo,
  useMenuItems,
  useUserSession,
  useRuntimeConfig,
  useLang,
} from "#imports";
import type { RouteLocationNormalizedLoaded } from "vue-router";

export default async function (
  to: RouteLocationNormalizedLoaded,
  from: RouteLocationNormalizedLoaded
) {
  const localePath = useLocalePath();
  const {
    i18n: { locale },
  } = useLang();
  const { routes } = useMenuItems(to);
  const { loggedIn } = useUserSession();

  const config = useRuntimeConfig().public?.authModule as any;
  const protectedPages = config.protectedPages || [];

  // Kontrola, zda je uzivatel prihlasen a zda se pokousi navigovat na chranenou stranku
  if (
    !loggedIn.value &&
    protectedPages.some(
      (page: string) =>
        to.path.startsWith(page) ||
        to.path.startsWith(`/${locale.value + page}`)
    )
  ) {
    return await navigateTo(localePath(routes.login?.path!), {
      redirectCode: 302,
    });
  }
}
