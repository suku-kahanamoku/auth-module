import { type H3Event } from "h3";
import {
  defineOAuthGoogleEventHandler,
  setUserSession,
  sendRedirect,
} from "#imports";

import type { ITokens } from "../../../types/auth.interface";

export default defineOAuthGoogleEventHandler({
  async onSuccess(
    event: H3Event,
    { tokens, user }: { tokens: ITokens; user: any }
  ) {
    if (user?.email) {
      user = {
        ...user,
        givenName: user.given_name,
        familyName: user.family_name,
      };
    }
    // nastavi user session
    await setUserSession(event, {
      user,
      tokens,
    });
    return await sendRedirect(event, "/pz");
  },
  async onError(event: H3Event) {
    return await sendRedirect(event, "/login");
  },
});
