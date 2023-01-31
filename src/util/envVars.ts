export const getPort = () => {
  return process.env.PORT || "";
};

export const getAllowedCors = () => {
  return process.env.ALLOWED_CORS || "";
};

export const getAuthPrivateKeyPath = () => {
  return process.env.JWT_PRIVATE_KEY_PATH || "";
};

export const getAuthPassphrase = () => {
  return process.env.PASSPHRASE || "";
};

export const getGoogleAppCredentialsPath = () => {
  return process.env.GOOGLE_APPLICATION_CREDENTIALS || "";
};
