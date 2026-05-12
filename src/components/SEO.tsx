import Head from 'next/head';
import { useRouter } from 'next/router';

interface ArticleMetadata {
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  authorUrl?: string;
  section?: string;
  tags?: string[];
}

interface ProfileMetadata {
  firstName?: string;
  lastName?: string;
  username?: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  article?: boolean;
  articleMeta?: ArticleMetadata;
  profile?: boolean;
  profileMeta?: ProfileMetadata;
  noindex?: boolean;
  localePathOverrides?: Record<string, string>;
  keywords?: string[];
}

const SEO = ({ 
  title, 
  description, 
  image, 
  imageAlt,
  imageWidth = 1200,
  imageHeight = 630,
  article, 
  articleMeta,
  profile,
  profileMeta,
  noindex = false,
  localePathOverrides,
  keywords,
}: SEOProps) => {

  const router = useRouter();
  const siteName = "Mota & Advogados Associados";
  const defaultDescription = "Escritório de advocacia especializado em Direito Administrativo, Trabalhista, Previdenciário e muito mais. Atuação em todo o Brasil.";
  const defaultImage = "https://mota.adv.br/og-image.jpg";
  const siteUrl = "https://mota.adv.br";
  const twitterHandle = "@motaadvogados";

  // Map router locale to OG locale format
  const localeMap: Record<string, string> = {
    'pt-BR': 'pt_BR',
    'en-US': 'en_US',
    'es-ES': 'es_ES',
    'de-DE': 'de_DE',
    'it-IT': 'it_IT',
    'fr-FR': 'fr_FR',
    'zh-CN': 'zh_CN',
  };

  const currentLocale = router.locale || 'pt-BR';
  const ogLocale = localeMap[currentLocale] || 'pt_BR';

  // Clean URL - remove query params and trailing slashes for canonical
  const cleanPath = router.asPath.split('?')[0].split('#')[0];
  const canonicalUrl = `${siteUrl}${cleanPath === '/' ? '' : cleanPath}`;

  const seo = {
    title: title ? `${title} | ${siteName}` : siteName,
    description: description?.slice(0, 160) || defaultDescription,
    image: image || defaultImage,
    imageAlt: imageAlt || title || siteName,
    url: canonicalUrl,
  };

  // Determine og:type
  const getOgType = () => {
    if (article) return 'article';
    if (profile) return 'profile';
    return 'website';
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.url} />
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} 
      />
      <meta 
        name="googlebot" 
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} 
      />

      {/* Keywords */}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Alternate Languages */}
      {localePathOverrides && 
        Object.entries(localePathOverrides).map(([locale, path]) => (
          <link 
            key={locale}
            rel="alternate" 
            hrefLang={locale.toLowerCase()} 
            href={`${siteUrl}${path.startsWith('/') ? path : '/' + path}`} 
          />
        ))
      }
      <link 
        rel="alternate" 
        hrefLang="x-default" 
        href={canonicalUrl} 
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={getOgType()} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:secure_url" content={seo.image} />
      <meta property="og:image:alt" content={seo.imageAlt} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:locale" content={ogLocale} />
      
      {/* Alternate OG Locales */}
      {localePathOverrides && 
        Object.keys(localePathOverrides)
          .filter(locale => locale !== currentLocale)
          .map(locale => (
            <meta 
              key={`og-locale-${locale}`}
              property="og:locale:alternate" 
              content={localeMap[locale] || locale.replace('-', '_')} 
            />
          ))
      }

      {/* Article Specific Meta */}
      {article && articleMeta && (
        <>
          {articleMeta.publishedTime && (
            <meta property="article:published_time" content={articleMeta.publishedTime} />
          )}
          {articleMeta.modifiedTime && (
            <meta property="article:modified_time" content={articleMeta.modifiedTime} />
          )}
          {articleMeta.author && (
            <meta property="article:author" content={articleMeta.authorUrl || articleMeta.author} />
          )}
          {articleMeta.section && (
            <meta property="article:section" content={articleMeta.section} />
          )}
          {articleMeta.tags?.map((tag, index) => (
            <meta key={`article-tag-${index}`} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Profile Specific Meta */}
      {profile && profileMeta && (
        <>
          {profileMeta.firstName && (
            <meta property="profile:first_name" content={profileMeta.firstName} />
          )}
          {profileMeta.lastName && (
            <meta property="profile:last_name" content={profileMeta.lastName} />
          )}
          {profileMeta.username && (
            <meta property="profile:username" content={profileMeta.username} />
          )}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:image:alt" content={seo.imageAlt} />

      {/* Additional Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#1a365d" />
      <meta name="author" content={siteName} />
    </Head>
  );
};

export default SEO;
