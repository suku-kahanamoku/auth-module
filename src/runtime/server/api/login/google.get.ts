import { type H3Event } from "h3";
import {
  defineOAuthGoogleEventHandler,
  setUserSession,
  sendRedirect,
  useRuntimeConfig,
  createError,
} from "#imports";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@suku-kahanamoku/mongoose-module/server-utils";

import type { ITokens } from "../../../types/auth.interface";
import { UserModel } from "../../../models/user.schema";

export default defineOAuthGoogleEventHandler({
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
        dbUser = await UserModel.create({
          ...user,
          givenName: user.given_name,
          familyName: user.family_name,
        });
      }
      user = { ...user, ...dbUser.toObject(), password: undefined, tempPassword: undefined };
    }
    // nastavi user session
    await setUserSession(event, {
      user,
      tokens,
    });
    return await sendRedirect(event, "/pz");
  },
  async onError(event: H3Event) {
    const i18n = useRuntimeConfig(event).public?.i18n;
    return await sendRedirect(event, "/login");
  },
});
