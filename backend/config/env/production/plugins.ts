export default ({ env }) => ({
  providers: {
    // Cloudinary provider for production file uploads
    cloudinary: {
      use: '@strapi/provider-upload-cloudinary',
      options: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
  // Security settings for production
  settings: {
    sizeLimit: 10 * 1024 * 1024, // 10MB
    responsiveDimensions: true,
  },
});
