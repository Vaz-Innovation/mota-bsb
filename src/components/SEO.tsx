import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  localePathOverrides?: Record<string, string>;
}

const SEO = ({ title, description, image, article, localePathOverrides }: SEOProps) => {

  const router = useRouter();
  const siteName = "Mota & Advogados Associados";
  const defaultDescription = "Escritório de advocacia especializado em Direito Administrativo, Trabalhista, Previdenciário e muito mais. Atuação em todo o Brasil.";
  const defaultImage = "https://mota.adv.br/og-image.jpg"; // Replace with actual OG image URL
  const siteUrl = "https://mota.adv.br";

  const seo = {
    title: title ? `${title} | ${siteName}` : siteName,
    description: description || defaultDescription,
    image: image || defaultImage,
    url: `${siteUrl}${router.asPath === '/' ? '' : router.asPath}`,
  };

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <link rel="canonical" href={seo.url} />

      {localePathOverrides && 
        Object.entries(localePathOverrides).map(([locale, path]) => (
          <link 
            key={locale}
            rel="alternate" 
            hrefLang={locale} 
            href={`${siteUrl}${path.startsWith('/') ? path : '/' + path}`} 
          />
        ))
      }
      {/* x-default fallback */}
      <link 
        rel="alternate" 
        hrefLang="x-default" 
        href={`${siteUrl}${router.asPath}`} 
      />

      {seo.url && <meta property="og:url" content={seo.url} />}

      {(article ? true : null) && <meta property="og:type" content="article" />}
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}
      {seo.image && <meta property="og:image" content={seo.image} />}

      <meta name="twitter:card" content="summary_large_image" />
      {seo.title && <meta name="twitter:title" content={seo.title} />}
      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}
      {seo.image && <meta name="twitter:image" content={seo.image} />}
      
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
  );
};

export default SEO;
