import type { NextApiRequest, NextApiResponse } from "next";

const WP_URL = process.env.WORDPRESS_API;
const WP_KEY = process.env.WORDPRESS_API_KEY;

function getAuthHeader() {
  return `Basic ${WP_KEY}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { email, source } = req.body;

  const username = email.split("@")[0] + Date.now();

  try {
    const token = getAuthHeader();

    const wpRes = await fetch(`${WP_URL}/?rest_route=/wp/v2/users`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        acf: {
          source,
        },
        password: Math.random().toString(36),
      }),
    });

    const data = await wpRes.json();

    if (!wpRes.ok) {
      return res.status(wpRes.status).json({
        error: data.message || "WP error",
        raw: data,
      });
    }

    return res.status(200).json({
      ok: true,
      userId: data.id,
      source: data.acf?.source,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
    });
  }
}
