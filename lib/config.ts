export const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/$/,
  "",
);

/** Clinic records stay in the browser only when `NEXT_PUBLIC_DATA_SOURCE=local`. */
export const isRemote =
  apiBaseUrl.length > 0 && process.env.NEXT_PUBLIC_DATA_SOURCE !== "local";

/** Accounts use the API whenever a base URL is configured. */
export const isRemoteAuth = apiBaseUrl.length > 0;
