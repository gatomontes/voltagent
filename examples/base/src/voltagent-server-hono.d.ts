declare module "@voltagent/server-hono" {
  import type { ServerProviderFactory } from "@voltagent/core";

  export function honoServer(...args: unknown[]): ServerProviderFactory;
}
