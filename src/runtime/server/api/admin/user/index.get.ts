import type { H3Event } from "h3";
import { defineEventHandler, getQuery } from "#imports";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@suku-kahanamoku/mongoose-module/server-utils";
import { RESOLVE_FACTORY } from "@suku-kahanamoku/common-module/server-utils";

import { UserModel } from "../../../../models/user.schema";
import { IUsersResponse } from "../../../../types";

export default defineEventHandler(
  async (event: H3Event): Promise<IUsersResponse> => {
    const query = getQuery(event);

    const where = JSON.parse((query.q || "{}") as string);
    const limit = Number.parseInt(query.limit as string, 10) || 100;
    const page = Number.parseInt(query.page as string, 10) || 1;
    const skip = (page - 1) * limit;

    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    const result = await UserModel.find(where).limit(limit).skip(skip);

    const total = await UserModel.countDocuments(where);

    const users = result?.map((i) => {
      const user = { ...i.toObject(), password: undefined, tempPassword: undefined };
      RESOLVE_FACTORY(user, query.factory);
      return user;
    });

    return {
      data: users,
      meta: { total, limit, skip },
    };
  }
);
