/* import { computed } from "vue"; */
import {
  defineStore,
  useUserSession,
  useLocalePath,
  navigateTo,
  useMenuItems,
  computed,
  useRuntimeConfig,
} from "#imports";
import type { StoreDefinition } from "pinia";

export const useAuthStore: StoreDefinition = defineStore("AuthStore", () => {
  const localePath = useLocalePath();
  const { routes } = useMenuItems();
  const userSessionStore = useUserSession();
  const config = useRuntimeConfig().public?.authModule as any;
  const protectedPages = config.protectedPages || [];

  // Prázdný uživatel podle IUser
  const emptyUser = {
    _id: "",
    email: "",
    name: "",
    surname: "",
    givenName: "",
    password: "",
    tempPassword: "",
    terms: false,
    newsletter: false,
    role: "guest",
    address: {
      main: undefined,
      variants: [],
    },
    phone: "",
    createdAt: undefined,
    updatedAt: undefined,
    valid: false,
  };

  const initials = computed(
    () =>
      `${
        (
          userSessionStore.user?.value?.givenName?.charAt(0) || ""
        ).toUpperCase() +
        (userSessionStore.user.value?.name?.charAt(0) || "").toUpperCase()
      }`
  );

  /**
   * Funkce pro prihlaseni
   *
   * @param {Record<string, any>} data
   * @return {*}  {Promise<void>}
   */
  const login = async (data: Record<string, any>): Promise<void> => {
    await $fetch("/api/login", { method: "POST", body: data });
    await userSessionStore.fetch();
    await navigateTo(localePath(protectedPages[0] || "/"));
  };

  /**
   * Prihlaseni pomoci google
   */
  const loginByGoogle = () => {
    location.href = "/api/login/google";
  };

  /**
   * Prihlaseni pomoci linkedin
   *
   */
  const loginByLinkedin = () => {
    location.href = "/api/login/linkedin";
  };

  /**
   * Prihlaseni pomoci facebook
   *
   */
  const loginByFacebook = () => {
    location.href = "/api/login/facebook";
  };

  /**
   * Funkce pro odhlaseni
   *
   * @return {*}  {Promise<void>}
   */
  const logout = async (): Promise<void> => {
    await userSessionStore.clear();
    await navigateTo(localePath(routes?.login?.path || "/"));
  };

  /**
   * Registrace
   *
   * @param {Record<string, any>} data
   * @return {*}  {Promise<void>}
   */
  const signup = async (data: Record<string, any>): Promise<void> => {
    await $fetch("/api/auth/signup", { method: "POST", body: data });
    await userSessionStore.fetch();
    await navigateTo(localePath(protectedPages[0] || "/"));
  };

  /**
   * Resetovani hesla
   *
   * @param {Record<string, any>} data
   * @return {*}  {Promise<void>}
   */
  const resetPassword = async (data: Record<string, any>): Promise<void> => {
    await $fetch("/api/auth/reset-password", { method: "POST", body: data });
  };

  return {
    login,
    loginByGoogle,
    loginByLinkedin,
    loginByFacebook,
    signup,
    logout,
    resetPassword,
    ...userSessionStore,
    initials,
    emptyUser,
  };
});
