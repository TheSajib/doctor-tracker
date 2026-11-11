export const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/$/,
  "",
);

export const isRemote =
  process.env.NEXT_PUBLIC_DATA_SOURCE === "remote" && apiBaseUrl.length > 0;
