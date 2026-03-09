import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEOHead({
  title = 'Aeronautical Department TGPCET',
  description = 'Official website of the Aeronautical Department TGPCET Nagpur',
  image = '/og-image.jpg',
  url = 'https://your-website-url.com',
  type = 'website',
}: SEOHeadProps) {
  const fullTitle = title === 'Aeronautical Department TGPCET' 
    ? title 
    : `${title} | Aeronautical Department TGPCET`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Aeronautical Department TGPCET" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="keywords" content="Aeronautical Engineering, TGPCET, Nagpur, Aerospace, Aviation, Engineering College, Department" />
      <meta name="author" content="Aeronautical Department TGPCET" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      
      {/* WhatsApp and other platforms also use Open Graph tags */}
      <meta property="og:locale" content="en_US" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Helmet>
  );
}
