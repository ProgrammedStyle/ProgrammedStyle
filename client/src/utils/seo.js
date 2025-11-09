/**
 * SEO utility functions
 */

export const DEFAULT_SEO = {
  title: 'ProgrammedStyle - Professional Web Development Services',
  description: 'Professional web development services. We build modern, responsive websites using React, Next.js, Node.js, and MongoDB.',
  keywords: 'web development, website design, react, nextjs, nodejs, professional websites',
  author: 'ProgrammedStyle',
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

export function generatePageTitle(pageTitle) {
  return pageTitle 
    ? `${pageTitle} | ProgrammedStyle` 
    : DEFAULT_SEO.title;
}

export function generateMetaTags(config = {}) {
  const {
    title = DEFAULT_SEO.title,
    description = DEFAULT_SEO.description,
    keywords = DEFAULT_SEO.keywords,
    image,
    url,
  } = config;

  const metaTags = [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'author', content: DEFAULT_SEO.author },
    
    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: DEFAULT_SEO.ogType },
    
    // Twitter
    { property: 'twitter:card', content: DEFAULT_SEO.twitterCard },
    { property: 'twitter:title', content: title },
    { property: 'twitter:description', content: description },
  ];

  if (image) {
    metaTags.push(
      { property: 'og:image', content: image },
      { property: 'twitter:image', content: image }
    );
  }

  if (url) {
    metaTags.push(
      { property: 'og:url', content: url },
      { property: 'twitter:url', content: url }
    );
  }

  return metaTags;
}

export function generateStructuredData(type, data) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return JSON.stringify(structuredData);
}

// Organization structured data
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ProgrammedStyle',
  url: 'https://www.programmedstyle.com',
  logo: 'https://www.programmedstyle.com/logo.png',
  description: 'Professional web development services',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Web Street',
    addressLocality: 'Digital City',
    addressRegion: 'DC',
    postalCode: '12345',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'Customer Service',
    email: 'info@programmedstyle.com',
  },
  sameAs: [
    'https://www.facebook.com/programmedstyle',
    'https://www.twitter.com/programmedstyle',
    'https://www.linkedin.com/company/programmedstyle',
  ],
};

