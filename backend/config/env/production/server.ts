export default ({ env }) => ({
  // Server configuration
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 10000),
  
  // Enable trust proxy for Render deployment
  proxy: env.bool('IS_PROXIED', true),
  
  // Render specific configuration
  url: env('RENDER_EXTERNAL_URL', env('PUBLIC_URL', `https://api.tagelong.com`)),
});
