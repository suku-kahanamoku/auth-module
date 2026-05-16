import type { IItem } from "@suku-kahanamoku/common-module/types";

declare module "#auth-utils" {
  interface User extends IItem {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string | null;
    role_id?: number;
    role?: { id: number; name: string };
    status?: "active" | "inactive" | "banned";
    deleted?: 0 | 1;
    last_login_at?: string;
    // client-side helpers
    valid?: boolean;
  }

  interface UserSession {
    loggedInAt?: Date | string;
    tokens?: ITokens;
  }
}

export * from "./types/auth.interface";
