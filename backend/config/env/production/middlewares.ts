export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'https://yourdomain.com',
        'https://www.yourdomain.com',
        /\.vercel\.app$/,
        ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
      ],
    },
  },
];
