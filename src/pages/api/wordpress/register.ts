import type { NextApiRequest, NextApiResponse } from "next";

interface RegisterRequest {
  email: string;
  name?: string;
  source?: string;
}

interface WordPressUserResponse {
  id: number;
  username: string;
  email: string;
}

interface WordPressError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const WORDPRESS_URL = process.env.WORDPRESS_API_URL;
  const WORDPRESS_API_KEY = process.env.WORDPRESS_API_KEY;

  if (!WORDPRESS_URL || !WORDPRESS_API_KEY) {
    return res.status(500).json({ error: "WordPress configuration is missing" });
  }

  // Extract base URL from GraphQL endpoint
  const baseUrl = WORDPRESS_URL.replace("/graphql", "");
  const restApiUrl = `${baseUrl}/wp-json/wp/v2/users`;

  const { email, name, source = "brasilia" } = req.body as RegisterRequest;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Generate username from email
  const username = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") + "_" + Date.now().toString(36);
  
  // Generate a random password
  const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase();

  try {
    // First, create the user
    const createUserResponse = await fetch(restApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${WORDPRESS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        first_name: name || "",
        roles: ["subscriber"],
      }),
    });

    const createUserData = await createUserResponse.json();

    if (!createUserResponse.ok) {
      const error = createUserData as WordPressError;
      
      // Check if user already exists
      if (error.code === "existing_user_email") {
        return res.status(409).json({ 
          error: "Este e-mail já está cadastrado",
          code: "existing_user_email"
        });
      }
      
      console.error("WordPress user creation error:", error);
      return res.status(createUserResponse.status).json({ 
        error: error.message || "Failed to create user" 
      });
    }

    const newUser = createUserData as WordPressUserResponse;

    // Now update the user with the source meta field using ACF
    // ACF fields are typically updated via /wp-json/acf/v3/users/{id} or via user meta
    const updateMetaUrl = `${baseUrl}/wp-json/wp/v2/users/${newUser.id}`;
    
    await fetch(updateMetaUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${WORDPRESS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meta: {
          source: source,
        },
        acf: {
          source: [source], // ACF checkbox field expects array
        },
      }),
    });

    return res.status(201).json({ 
      success: true, 
      message: "Usuário registrado com sucesso",
      userId: newUser.id 
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Registration failed",
    });
  }
}
