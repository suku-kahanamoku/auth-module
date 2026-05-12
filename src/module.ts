import {
  defineNuxtModule,
  hasNuxtModule,
  installModule,
  createResolver,
  addImportsDir,
  addRouteMiddleware,
  addComponentsDir,
  addPlugin,
  addServerImportsDir,
  addServerPlugin,
} from "@nuxt/kit";
import defu from "defu";

// Module options TypeScript interface definition
export interface ModuleOptions {
  protectedPages?: string[];
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "auth-module",
    configKey: "authModule",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    protectedPages: ["/pz", "/admin"],
  },
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const nuxtOpt = _nuxt.options as any;
    const runtimeConfig = nuxtOpt.runtimeConfig;

    runtimeConfig.public = runtimeConfig.public || {};
    runtimeConfig.public.authModule = nuxtOpt.authModule || _options;

    // nastaveni auth session
    runtimeConfig.session = defu(runtimeConfig.session || {}, {
      maxAge: 60 * 60 * 24,
      enableRefreshOnWindowFocus: true,
      password: "b8d172bdf0bc45d38329605e0420653c",
    });

    _nuxt.hook("i18n:registerModule", (register) => {
      register({
        langDir: resolve("./runtime/assets/locales"),
        locales: [
          {
            code: "en",
            file: "en.json",
          },
          {
            code: "cs",
            file: "cs.json",
          },
        ],
      });
    });

    // Pridani komponent
    addComponentsDir({
      path: resolve("./runtime/components"),
      prefix: "Cmp",
      pathPrefix: false,
    });

    // Pridani composables
    addImportsDir(resolve("./runtime/composables"));

    // Přidání pluginů
    addPlugin({
      src: resolve("./runtime/plugins/auth"),
      mode: "client",
    });

    // Pridani client middleware
    addRouteMiddleware({
      name: "auth",
      path: resolve("./runtime/middleware/auth"),
      global: true,
    });

    // Přidání server composables
    addServerImportsDir(resolve("./runtime/server/composables"));

    // Kontrola zda token expiroval
    addServerPlugin(resolve("./runtime/server/plugins/auth"));

    // Install auth utils module
    if (!hasNuxtModule("nuxt-auth-utils")) {
      await installModule("nuxt-auth-utils");
    }

    // Install notify module
    if (!hasNuxtModule("@suku-kahanamoku/notify-module")) {
      await installModule("@suku-kahanamoku/notify-module");
    }

    // Install common module
    if (!hasNuxtModule("@suku-kahanamoku/common-module")) {
      await installModule("@suku-kahanamoku/common-module");
    }

    // Install lang module
    if (!hasNuxtModule("@suku-kahanamoku/lang-module")) {
      await installModule("@suku-kahanamoku/lang-module");
    }

    // Install ui module
    if (!hasNuxtModule("@suku-kahanamoku/ui-module")) {
      await installModule("@suku-kahanamoku/ui-module");
    }

    // Install form module
    if (!hasNuxtModule("@suku-kahanamoku/form-module")) {
      await installModule("@suku-kahanamoku/form-module");
    }

    // Install menu module
    if (!hasNuxtModule("@suku-kahanamoku/menu-module")) {
      await installModule("@suku-kahanamoku/menu-module");
    }
  },
});
