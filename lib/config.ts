export const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/$/,
  "",
);

export const isRemote =
  process.env.NEXT_PUBLIC_DATA_SOURCE === "remote" && apiBaseUrl.length > 0;

/** Accounts use the API whenever a base URL is configured. Clinic records follow `isRemote`. */
export const isRemoteAuth = apiBaseUrl.length > 0;
