import {
  defineNuxtModule,
  hasNuxtModule,
  installModule,
  createResolver,
  addImportsDir,
  addServerHandler,
  addRouteMiddleware,
  addComponentsDir,
  addPlugin,
  addServerImportsDir,
  addServerPlugin,
} from "@nuxt/kit";
import defu from "defu";
import * as fs from "node:fs";

import {
  GENERATE_PAGES,
  GENERATE_API_ENDPOINT,
  READ_FILE,
} from "@suku-kahanamoku/common-module/server-utils";

// Module options TypeScript interface definition
export interface ModuleOptions {
  disablePages?: boolean;
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

    // Config pro lang-module
    nuxtOpt.langModule = defu(nuxtOpt.langModule || {}, {
      locales: [
        {
          code: "en",
          file: resolve("./runtime/assets/locales/en.json"),
        },
        {
          code: "cs",
          file: resolve("./runtime/assets/locales/cs.json"),
        },
      ],
      langDir: resolve("./runtime/assets/locales"),
    });

    // Vynuti tailwind pro runtime komponenty
    nuxtOpt.tailwindcss = defu(nuxtOpt.tailwindcss || {}, {
      config: {
        content: [
          resolve("./runtime/components/**/*.{vue,mjs,js,ts}"),
          resolve("./runtime/layouts/**/*.{vue,mjs,js,ts}"),
          resolve("./runtime/pages/**/*.{vue,mjs,js,ts}"),
          resolve("./runtime/*.{mjs,js,ts}"),
        ],
      },
    });

    // Pridani jednotlivych pages
    if (!_options.disablePages) {
      // Dynamicky nacitat vsechny pages z runtime/pages
      GENERATE_PAGES("/", resolve);
      GENERATE_PAGES("/pz", resolve);
      GENERATE_PAGES("/admin", resolve);
    }

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

    // Login api login endpoints
    const apiLoginDir = resolve("./runtime/server/api/login");
    fs.readdirSync(apiLoginDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/login", resolve);
    });

    // Login api auth endpoints
    const apiAuthDir = resolve("./runtime/server/api/auth");
    fs.readdirSync(apiAuthDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/auth", resolve);
    });

    // Login api auth endpoints
    const apiAdminDir = resolve("./runtime/server/api/admin/user");
    fs.readdirSync(apiAdminDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/admin/user", resolve);
    });

    // Install pinia module
    if (!hasNuxtModule("@pinia/nuxt")) {
      await installModule("@pinia/nuxt");
    }

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
