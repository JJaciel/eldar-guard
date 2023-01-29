import { createToken } from "./jwt";
import * as jwt from "jsonwebtoken";

describe("JWT", () => {
  beforeAll(() => {
    process.env.JWT_PRIVATE_KEY_PATH = "secrets/keys/test/private_key.pem";
    process.env.PASSPHRASE = "test";
  });

  afterAll(() => {
    process.env.JWT_PRIVATE_KEY_PATH = "";
    process.env.PASSPHRASE = "";
  });

  test("createToken creates a token", () => {
    expect(createToken("any-user-id")).toBeTruthy();
  });
});
