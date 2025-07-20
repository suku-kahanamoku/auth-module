import { type H3Event } from "h3";
import {
  defineOAuthLinkedInEventHandler,
  setUserSession,
  sendRedirect,
  useRuntimeConfig,
  createError,
} from "#imports";
import { tryCookieLocale } from "@intlify/utils/h3";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@suku-kahanamoku/mongoose-module/server-utils";

import type { ITokens } from "../../../types/auth.interface";
import { UserModel } from "../../../models/user.schema";

export default defineOAuthLinkedInEventHandler({
  async onSuccess(
    event: H3Event,
    { tokens, user }: { tokens: ITokens; user: any }
  ) {
    const i18n = useRuntimeConfig(event).public?.i18n;
    // pokud uzivatel v db neexistuje, vytvori ho
    if (user?.email) {
      let dbUser;
      // Nejdrive zkontroluje, zda je pripojeni k databazi
      if (GET_STATUS() === 0) {
        await CONNECT_WITH_RETRY();
      }

      dbUser = await UserModel.findOne({ email: user.email });

      if (!dbUser?._id) {
        dbUser = await UserModel.create(user);
      }
      user = { ...user, ...dbUser.toObject() };
    }
    // nastavi user session
    await setUserSession(event, {
      user,
      tokens,
    });
    const locale =
      tryCookieLocale(event, {
        lang: "",
        name: i18n?.detectBrowserLanguage?.cookieKey,
      })?.toString() || i18n?.defaultLocale;
    return await sendRedirect(event, "/pz");
  },

  async onError(event: H3Event) {
    const i18n = useRuntimeConfig(event).public?.i18n;
    const locale =
      tryCookieLocale(event, {
        lang: "",
        name: i18n?.detectBrowserLanguage?.cookieKey,
      })?.toString() || i18n?.defaultLocale;
    return await sendRedirect(
      event,
      locale === "en" ? "/login" : `/${locale}/login`
    );
  },
});
