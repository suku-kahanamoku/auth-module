import { type H3Event } from "h3";
import {
  defineOAuthFacebookEventHandler,
  setUserSession,
  sendRedirect,
} from "#imports";

import type { ITokens } from "../../../types/auth.interface";

export default defineOAuthFacebookEventHandler({
  async onSuccess(
    event: H3Event,
    { tokens, user }: { tokens: ITokens; user: any }
  ) {
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
