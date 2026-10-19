import { cacheLife } from "next/cache";

/**
 * Copyright year, generated on the server. Cached with a daily lifetime so
 * prerendered pages pick up a new year without a rebuild.
 */
async function getYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function CurrentYear() {
  const year = await getYear();
  return <>{year}</>;
}
