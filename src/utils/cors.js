// CORS middleware for all routes
export const corsMiddleware = async (c, next) => {
  // Set CORS headers for all requests
  const origin = c.req.header('Origin');
  
  // Allow localhost in development and your production domain
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://127.0.0.1:3000',
    'https://hono-chavy.fly.dev'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV === 'development') {
    // In development, allow all localhost origins
    c.header('Access-Control-Allow-Origin', '*');
  }
  
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  c.header('Access-Control-Allow-Credentials', 'true');
  c.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight OPTIONS requests
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }
  
  await next();
};