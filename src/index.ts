import debug = require("debug");
import { match, Path } from "path-to-regexp";
import { CommonRequest, CommonResponse } from "servie/dist/common";
import { getURL } from "servie-url";

const log = debug("servie-mount");

export const path = Symbol("path");
export const params = Symbol("params");
export const originalUrl = Symbol("originalUrl");

export interface MountRequest<P extends object = object> {
  [originalUrl]: string;
  [path]: string;
  [params]: P;
}

export type Options = Partial<
  Record<"sensitive" | "strict" | "start" | "end", boolean>
>;

export function mount<
  T extends CommonRequest,
  U extends CommonResponse,
  P extends object = object
>(
  prefix: Path,
  fn: (req: T & MountRequest, done: () => Promise<U>) => Promise<U>,
  options?: Options
) {
  const check = match<P>(prefix, {
    end: false,
    encode: encodeURI,
    decode: decodeURIComponent,
    ...options
  });

  log(`mount ${prefix}`);

  return function(req: T & Partial<MountRequest<P>>, next: () => Promise<U>) {
    const url = getURL(req);
    const match = check(url.pathname);
    if (!match) return next();

    const prevUrl = req.url;
    const prevMountPath = req[path];
    const prevParams = req[params];

    const origin = prevUrl.startsWith(url.protocol) ? url.origin : "";
    const pathname =
      url.pathname.substr(0, match.index) +
        url.pathname.substr(match.path.length) || "/";

    // Update `url` to mounted pathname.
    req.url = `${origin}${pathname}${url.search}${url.hash}`;

    // Set mounted parameters on request.
    const mountReq = Object.assign(req, {
      [path]: match.path,
      [params]: match.params,
      [originalUrl]: req[originalUrl] || prevUrl
    });

    debug(`enter ${prevUrl} -> ${req.url}`);

    return fn(mountReq, function() {
      debug(`leave ${prevUrl} <- ${req.url}`);
      req.url = prevUrl;
      req[path] = prevMountPath;
      req[params] = prevParams;
      return next();
    });
  };
}
