import { BaseExecutor } from "./base.js";
import { PROVIDERS } from "../config/providers.js";

/**
 * WindsurfExecutor - Routes requests to a WindsurfAPI instance
 * WindsurfAPI (https://github.com/dwgx/WindsurfAPI) acts as a bridge:
 *   9Router → WindsurfAPI (HTTP/OpenAI) → LS binary (gRPC) → Windsurf cloud
 *
 * Auth: The connection's apiKey is the WindsurfAPI API_KEY (not the cog_ token).
 * The cog_ Devin.ai tokens are added to WindsurfAPI's account pool separately.
 *
 * Connection providerSpecificData:
 *   baseUrl: WindsurfAPI instance URL (default: http://localhost:3003)
 */
export class WindsurfExecutor extends BaseExecutor {
  constructor() {
    super("windsurf", PROVIDERS.windsurf);
  }

  buildUrl(model, stream, urlIndex = 0, credentials = null) {
    const baseUrl = credentials?.providerSpecificData?.baseUrl
      || process.env.WINDSURF_API_URL
      || "http://localhost:3003";
    return `${baseUrl.replace(/\/$/, "")}/v1/chat/completions`;
  }

  buildHeaders(credentials, stream = true) {
    const headers = { "Content-Type": "application/json" };

    const apiKey = credentials?.apiKey || credentials?.accessToken;
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    if (stream) {
      headers["Accept"] = "text/event-stream";
    }

    return headers;
  }

  transformRequest(model, body, stream, credentials) {
    return body;
  }
}

export default WindsurfExecutor;
