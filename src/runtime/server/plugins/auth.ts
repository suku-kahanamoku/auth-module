import {
  defineNitroPlugin,
  sessionHooks,
  createError,
  setUserSession,
} from "#imports";
import { jwtDecode } from "jwt-decode";

import { UserModel } from "../../models/user.schema";

export default defineNitroPlugin(() => {
  sessionHooks.hook("fetch", async (session, event) => {
    // Kontrola expirace tokenu
    const idToken = session?.tokens?.id_token;
    if (idToken) {
      try {
        const decoded: any = jwtDecode(idToken);
        if (decoded?.exp) {
          const now = Math.floor(Date.now() / 1000);
          // Pokud je token expirovaný, vyhodit chybu
          if (now > decoded.exp) {
            throw createError({
              statusCode: 401,
              message: "Session expired",
            });
          }

          const user = await UserModel.findOne({
            email: session.user.email,
          });
          const result = {
            ...user?.toObject(),
            password: undefined,
            tempPassword: undefined,
          };

          // nastavi user session
          await setUserSession(event, {
            result,
            tokens: session.tokens,
          });
        }
      } catch (e) {
        // Pokud dojde k chybě při dekódování tokenu, vyhodi chybu
        throw createError({
          statusCode: 401,
          message: "Invalid session token",
        });
      }
    }
  });
});
