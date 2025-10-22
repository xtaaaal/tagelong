// Custom admin panel configuration for field ordering
// This file can help control the display order of fields

export default {
  config: {
    // Content Manager configuration
    contentManager: {
      // Customize the itinerary content type view
      'api::itinerary.itinerary': {
        // Define the order of fields in the edit view
        edit: {
          // Main fields in desired order
          mainFields: [
            'title',
            'mainPicture', 
            'country',
            'region',
            'city',
            'tags',
            'price',
            'isFree',
            'highlights',
            'fileUpload',
            'themeLayout',  // This should be after fileUpload
            'publishStatus',
            'Day'
          ],
          // Sidebar fields (if any)
          sidebarFields: []
        },
        // Define the order in list view
        list: {
          displayFields: [
            'title',
            'country',
            'publishStatus',
            'themeLayout',
            'createdAt'
          ]
        }
      }
    }
  }
};
