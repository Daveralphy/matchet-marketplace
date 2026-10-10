const BACKEND_URL = String(process.env.BACKEND_API_URL || process.env.VITE_API_URL || "").replace(/\/$/, "");

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (!BACKEND_URL) {
    return res.status(500).json({
      success: false,
      message: "The API URL is not configured.",
      code: "API_URL_NOT_CONFIGURED",
    });
  }

  const requestUrl = new URL(req.url, "https://matchet.local");
  const targetUrl = BACKEND_URL + requestUrl.pathname + requestUrl.search;

  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (!value || key.toLowerCase() === "host") continue;
      headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }

    const method = String(req.method || "GET").toUpperCase();
    const body = ["GET", "HEAD"].includes(method) ? undefined : await getRequestBody(req);

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: "manual",
    });

    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") return;
      if (["transfer-encoding", "connection", "content-encoding"].includes(key.toLowerCase())) return;
      res.setHeader(key, value);
    });

    const setCookies =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : response.headers.get("set-cookie");

    if (setCookies && setCookies.length) {
      res.setHeader("set-cookie", setCookies);
    }

    return res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error("API proxy error:", error);
    return res.status(502).json({
      success: false,
      message: "Matchet is temporarily unable to reach the API.",
      code: "API_PROXY_ERROR",
    });
  }
}
