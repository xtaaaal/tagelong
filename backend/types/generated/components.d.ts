import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentsFeature extends Struct.ComponentSchema {
  collectionName: 'components_components_features';
  info: {
    displayName: 'Feature';
  };
  attributes: {
    heading: Schema.Attribute.String;
    icon: Schema.Attribute.Enumeration<
      ['CLOCK_ICON', 'CHECK_ICON', 'CLOUD_ICON']
    >;
    subHeading: Schema.Attribute.Text;
  };
}

export interface ComponentsLink extends Struct.ComponentSchema {
  collectionName: 'components_components_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ItineraryDay extends Struct.ComponentSchema {
  collectionName: 'components_itinerary_days';
  info: {
    description: 'Daily itinerary component';
    displayName: 'Day';
  };
  attributes: {
    dayNumber: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    dayType: Schema.Attribute.Enumeration<
      ['Arrival Day', 'Departure Day', 'Input Number', 'Other Subtitle']
    > &
      Schema.Attribute.DefaultTo<'Input Number'>;
    fileUpload: Schema.Attribute.Media<'files'>;
    googleMapsLink: Schema.Attribute.String;
    picture: Schema.Attribute.Media<'images'>;
    recommendation: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    showDistanceFromLastStop: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
  };
}

export interface LayoutFeaturesSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_features_sections';
  info: {
    displayName: 'Features Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    feature: Schema.Attribute.Component<'components.feature', true>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    logoText: Schema.Attribute.Component<'components.link', false>;
    socialLink: Schema.Attribute.Component<'components.link', true>;
    text: Schema.Attribute.String;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    description: '';
    displayName: 'Header';
  };
  attributes: {
    ctaButton: Schema.Attribute.Component<'components.link', false>;
    logoText: Schema.Attribute.Component<'components.link', false>;
  };
}

export interface LayoutHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_hero_sections';
  info: {
    description: '';
    displayName: 'Hero Section';
  };
  attributes: {
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.Component<'components.link', false>;
    subHeading: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'components.feature': ComponentsFeature;
      'components.link': ComponentsLink;
      'itinerary.day': ItineraryDay;
      'layout.features-section': LayoutFeaturesSection;
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'layout.hero-section': LayoutHeroSection;
    }
  }
}
