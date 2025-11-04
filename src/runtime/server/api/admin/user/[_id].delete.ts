import { H3Event } from "h3";
import { defineEventHandler, getQuery } from "#imports";

import { RESOLVE_FACTORY } from "@suku-kahanamoku/common-module/server-utils";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@suku-kahanamoku/mongoose-module/server-utils";

import { UserModel } from "../../../../models/user.schema";
import { IUserResponse } from "../../../../types";

export default defineEventHandler(
  async (event: H3Event): Promise<IUserResponse> => {
    const query = getQuery(event);

    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    const user = await UserModel.findOneAndDelete({
      _id: event.context.params?.id,
    });
    const result = { ...user?.toObject(), password: undefined, tempPassword: undefined };
    RESOLVE_FACTORY(result, query.factory);

    return {
      data: result,
      meta: { total: result ? 1 : 0 },
    };
  }
);
