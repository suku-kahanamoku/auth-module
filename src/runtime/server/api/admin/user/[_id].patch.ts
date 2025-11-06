import { H3Event } from "h3";
import {
  defineEventHandler,
  getQuery,
  useTranslation,
  readBody,
  createError,
  hashPassword,
  verifyPassword,
} from "#imports";

import { RESOLVE_FACTORY } from "@suku-kahanamoku/common-module/server-utils";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@suku-kahanamoku/mongoose-module/server-utils";

import { UserModel } from "../../../../models/user.schema";
import { IUserResponse } from "../../../../types";

export default defineEventHandler(
  async (event: H3Event): Promise<IUserResponse> => {
    const t = await useTranslation(event);
    const query = getQuery(event);
    const body = await readBody(event);
    delete body._id, body.email;

    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    // kontrola uzivatele
    const dbUser = await UserModel.findById(event.context.params?.id);
    if (dbUser?._id) {
      if (body.password) {
        // kontrola hesla
        const isPassValid = await verifyPassword(
          dbUser.password || "",
          body.password
        );
        const isTempPassValid = await verifyPassword(
          dbUser.tempPassword || "",
          body.password
        );
        delete body.password;
        if (!isPassValid && !isTempPassValid) {
          throw createError({
            statusCode: 400,
            statusMessage: t("$.message.incorrect_login"),
            message: t("$.message.password_not_match"),
          });
        }
        // zmena hesla
        if (body.newPassword) {
          body.password = await hashPassword(body.newPassword);
        }
      }
    }
    // pokud uzivatel neexistuje, zarve chybu
    else {
      throw createError({
        statusCode: 404,
        statusMessage: t("$.message.not_found"),
        message: t("$.message.user_not_exists"),
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      event.context.params?.id,
      body,
      {
        new: true,
      }
    );
    const result = {
      ...user?.toObject(),
      password: undefined,
      tempPassword: undefined,
    };
    RESOLVE_FACTORY(result, query.factory);

    return {
      data: result,
      meta: { total: result ? 1 : 0 },
    };
  }
);
