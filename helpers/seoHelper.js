/**
 * SEO & Schema.org Structured Data Helper
 */

const generateSchemaOrg = {
  organization: (siteName, siteUrl, logoUrl) => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": siteName || "WanderLust Tours",
      "url": siteUrl || "http://localhost:3000",
      "logo": logoUrl || "http://localhost:3000/images/logo.png",
      "description": "Premium travel tour booking website offering worldwide curated experiences.",
      "telephone": "+1-800-555-WANDER",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "100 Ocean Drive",
        "addressLocality": "Miami",
        "addressRegion": "FL",
        "postalCode": "33139",
        "addressCountry": "US"
      },
      "sameAs": [
        "https://facebook.com",
        "https://instagram.com",
        "https://twitter.com"
      ]
    });
  },

  touristTrip: (tour, siteUrl) => {
    if (!tour) return '';
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": tour.name,
      "description": tour.shortDescription || tour.metaDescription,
      "image": tour.featuredImage,
      "touristType": [tour.category ? tour.category.name : "Leisure"],
      "offers": {
        "@type": "Offer",
        "price": tour.discountPrice || tour.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": "2026-01-01",
        "url": `${siteUrl}/tours/${tour.slug}`
      },
      "itinerary": tour.itinerary ? (typeof tour.itinerary === 'string' ? JSON.parse(tour.itinerary) : tour.itinerary).map(item => ({
        "@type": "ItemList",
        "name": item.title,
        "description": item.description
      })) : []
    });
  },

  breadcrumb: (items, siteUrl) => {
    const itemListElement = items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `${siteUrl}${item.url}` : undefined
    }));
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": itemListElement
    });
  },

  faq: (faqs) => {
    if (!faqs || faqs.length === 0) return '';
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
  },

  blogPosting: (blog, siteUrl) => {
    if (!blog) return '';
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "image": blog.featuredImage,
      "author": {
        "@type": "Person",
        "name": blog.author ? blog.author.name : "Travel Expert"
      },
      "publisher": {
        "@type": "Organization",
        "name": "WanderLust Tours"
      },
      "datePublished": blog.createdAt,
      "description": blog.excerpt || blog.metaDescription
    });
  }
};

module.exports = { generateSchemaOrg };
