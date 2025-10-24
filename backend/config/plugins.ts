export default ({env}) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: 'xtaaaal@gmail.com',
        defaultReplyTo: 'xtaaaal@gmail.com',
      },
    },
  },
  'users-permissions': {
    config: {
      providers: {
        google: {
          enabled: true,
          clientId: env('GOOGLE_CLIENT_ID'),
          clientSecret: env('GOOGLE_CLIENT_SECRET'),
          redirectURL: env('GOOGLE_REDIRECT_URL', 'https://tagelong.com/api/auth/callback/google'),
        },
      },
    },
  },
  // Conditional upload provider based on environment
  ...(env('NODE_ENV') === 'production' && env('CLOUDINARY_NAME') ? {
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_KEY'),
          api_secret: env('CLOUDINARY_SECRET'),
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
  } : {}),
});
