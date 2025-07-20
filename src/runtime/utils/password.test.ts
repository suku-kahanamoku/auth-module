import { describe, it, expect } from "vitest";
import bcrypt from "bcrypt";

import {
  COMPARE_PASSWORD,
  GENERATE_HASHED_PASSWORD,
  GENERATE_PASSWORD,
} from "./password.functions";

describe("GENERATE_PASSWORD", () => {
  it("should generate a password of the default length 8", () => {
    const password = GENERATE_PASSWORD();
    expect(password).toHaveLength(8);
  });

  it("should generate a password of the specified length", () => {
    const length = 12;
    const password = GENERATE_PASSWORD(length);
    expect(password).toHaveLength(length);
  });

  it("should generate a password containing only allowed characters", () => {
    const password = GENERATE_PASSWORD(10);
    expect(password).toMatch(/^[a-zA-Z0-9]+$/);
  });
});

describe("GENERATE_HASHED_PASSWORD", () => {
  it("should return a hashed password", async () => {
    const hashedPassword = await GENERATE_HASHED_PASSWORD("testPassword");
    expect(hashedPassword).toMatch(/^\$2[ayb]\$.{56}$/);
  });

  it("should generate a hash for a generated password", async () => {
    const password = "testPassword";
    const hashedPassword = await GENERATE_HASHED_PASSWORD(password);
    const isMatch = await bcrypt.compare(password, hashedPassword);
    expect(isMatch).toBe(true);
  });
});

describe("COMPARE_PASSWORD", () => {
  it("should return true for correct password match", async () => {
    const password = "testPassword";
    const hashedPassword = await GENERATE_HASHED_PASSWORD(password);
    const isMatch = await COMPARE_PASSWORD(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it("should return false for incorrect password match", async () => {
    const password = "testPassword";
    const wrongPassword = "wrongPassword";
    const hashedPassword = await GENERATE_HASHED_PASSWORD(password);
    const isMatch = await COMPARE_PASSWORD(wrongPassword, hashedPassword);
    expect(isMatch).toBe(false);
  });
});
