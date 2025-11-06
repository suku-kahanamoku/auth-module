import type { H3Event } from "h3";
import {
  defineEventHandler,
  readBody,
  createError,
  setUserSession,
  verifyPassword,
} from "#imports";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@suku-kahanamoku/mongoose-module/server-utils";

import { UserModel } from "../../../models/user.schema";
import { IUserResponse } from "../../../types";

export default defineEventHandler(
  async (event: H3Event): Promise<IUserResponse> => {
    const body = await readBody(event);

    // kontrola, zda jsou zadane vsechny potrebne fieldy
    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields.",
      });
    }

    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    const user = await UserModel.findOne({ email: body.email });

    // kontrola uzivatele a hesla
    if (user?._id) {
      const isPassValid = await verifyPassword(
        user.password || "",
        body.password
      );
      const isTempPassValid = await verifyPassword(
        user.tempPassword || "",
        body.password
      );
      if (!isPassValid && !isTempPassValid) {
        throw createError({
          statusCode: 401,
          message: "Incorrect login credentials.",
        });
      }
    }
    // pokud uzivatel neexistuje, zarve chybu
    else {
      throw createError({
        statusCode: 401,
        message: "Incorrect login credentials.",
      });
    }

    const result = {
      ...user?.toObject(),
      password: undefined,
      tempPassword: undefined,
    };
    // nastavi user session
    await setUserSession(event, {
      user,
    });

    return {
      data: result,
      meta: { total: result ? 1 : 0 },
    };
  }
);
