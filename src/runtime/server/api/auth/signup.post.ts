import type { H3Event } from "h3";
import {
  defineEventHandler,
  readBody,
  setUserSession,
  createError,
  hashPassword,
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
    if (!body.email || !body.password || !body.terms) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields.",
      });
    }

    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    let user = await UserModel.findOne({ email: body.email });

    // kontrola zda uzivatel jiz existuje
    if (user?._id) {
      throw createError({
        statusCode: 400,
        message: "User already exists.",
      });
    }
    // pokud neexistuje vytvori noveho uzivatele v DB
    else {
      user = await UserModel.create({
        ...body,
        password: await hashPassword(body.password),
      });

      await $fetch("/api/email/signup", {
        method: "POST",
        body,
      });
    }

    const result = {
      ...user.toObject(),
      password: undefined,
      tempPassword: undefined,
    };

    // nastavi session
    await setUserSession(event, {
      user: result,
    });

    return {
      data: result,
      meta: { total: result ? 1 : 0 },
    };
  }
);
