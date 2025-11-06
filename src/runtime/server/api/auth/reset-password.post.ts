import type { H3Event } from "h3";
import { defineEventHandler, hashPassword, readBody } from "#imports";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@suku-kahanamoku/mongoose-module/server-utils";

import { GENERATE_PASSWORD } from "../../../utils/password.functions";
import { UserModel } from "../../../models/user.schema";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const password = GENERATE_PASSWORD();

  // Nejdrive zkontroluje, zda je pripojeni k databazi
  if (GET_STATUS() === 0) {
    await CONNECT_WITH_RETRY();
  }

  const user = await UserModel.findOne({ email: body.email });

  if (user?._id) {
    await UserModel.updateOne(
      { _id: user._id },
      { tempPassword: await hashPassword(password) }
    );

    await $fetch("/api/email/reset-password", {
      method: "POST",
      body: { ...body, password },
    });
  }

  return { message: "Email successfully sent" };
});
