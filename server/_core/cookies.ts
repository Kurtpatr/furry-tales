import type { CookieOptions, Request } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";
import { DEMO_COOKIE_NAME } from "@shared/const";
import { ENV } from "./env";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  // Basic IPv4 check and IPv6 presence detection.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  // const hostname = req.hostname;
  // const shouldSetDomain =
  //   hostname &&
  //   !LOCAL_HOSTS.has(hostname) &&
  //   !isIpAddress(hostname) &&
  //   hostname !== "127.0.0.1" &&
  //   hostname !== "::1";

  // const domain =
  //   shouldSetDomain && !hostname.startsWith(".")
  //     ? `.${hostname}`
  //     : shouldSetDomain
  //       ? hostname
  //       : undefined;

  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req),
  };
}

function signDemoId(id: string) {
  return createHmac("sha256", ENV.cookieSecret).update(id).digest("base64url");
}

export function createDemoCookieValue(id: string) {
  return `${id}.${signDemoId(id)}`;
}

export function readDemoCookieId(req: Request) {
  const raw = req.headers.cookie
    ?.split(";")
    .map(value => value.trim())
    .find(value => value.startsWith(`${DEMO_COOKIE_NAME}=`))
    ?.slice(DEMO_COOKIE_NAME.length + 1);
  if (!raw) return null;
  const [id, signature] = raw.split(".");
  if (!id || !signature || !ENV.cookieSecret) return null;
  const expected = signDemoId(id);
  if (signature.length !== expected.length) return null;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ? id
    : null;
}

export { DEMO_COOKIE_NAME };
