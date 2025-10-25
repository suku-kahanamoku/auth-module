import type { H3Event } from "h3";
import {
  defineEventHandler,
  readBody,
  useMailing,
  useTranslation,
} from "#imports";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@suku-kahanamoku/mongoose-module/server-utils";

import ResetPasswordForm from "../../../emails/ResetPassword.vue";

import {
  GENERATE_PASSWORD,
  GENERATE_HASHED_PASSWORD,
} from "../../../utils/password.functions";
import { UserModel } from "../../../models/user.schema";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const newPassword = GENERATE_PASSWORD();

  // Nejdrive zkontroluje, zda je pripojeni k databazi
  if (GET_STATUS() === 0) {
    await CONNECT_WITH_RETRY();
  }

  const user = await UserModel.findOne({ email: body.email });

  if (user?._id) {
    await UserModel.updateOne(
      { _id: user._id },
      { tempPassword: await GENERATE_HASHED_PASSWORD(newPassword) }
    );

    const t = await useTranslation(event);
    // odesle mail se zapomenutym heslem
    const { template, send } = await useMailing(event);
    await send({
      subject: t("$.mailing.forgot_password.subject"),
      template: await template(ResetPasswordForm, {
        url: process.env.FRONTEND_HOST,
        email: body.email,
        password: newPassword,
      }),
      to: [
        {
          Email: body.email,
        },
      ],
    });
  }

  return { message: "Email successfully sent" };
});
