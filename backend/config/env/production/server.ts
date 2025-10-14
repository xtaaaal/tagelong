export default ({ env }) => ({
  // Server configuration
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  
  // Enable trust proxy for Railway deployment
  proxy: env.bool('IS_PROXIED', true),
  
  // Railway specific configuration
  url: env('RAILWAY_STATIC_URL', env('PUBLIC_URL', `http://${env('HOST', '0.0.0.0')}:${env.int('PORT', 1337)}`)),
});
