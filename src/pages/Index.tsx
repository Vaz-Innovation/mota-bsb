import { useEffect } from "react";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import type { GetStaticProps } from "next";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { ProcessSearchSection } from "@/components/ProcessSearchSection";
import { AboutSection } from "@/components/AboutSection";
import { PracticeAreasSection } from "@/components/PracticeAreasSection";
import { TeamSection } from "@/components/TeamSection";
import { LatestNewsSection } from "@/components/LatestNewsSection";
import { ContactSection } from "@/components/ContactSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieBanner } from "@/components/CookieBanner";
import SEO from "@/components/SEO";
import { gqlQueryOptions } from "@/graphql/gqlpc";
import { HomeQuery } from "@/graphql/pages/home";
import { resolveWpLanguage } from "@/graphql/locale-to-wp-language";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(router.query.scrollTo as string);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      const { scrollTo, ...restQuery } = router.query;
      router.replace({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true });
    }
  }, [router.query.scrollTo, router]);

  return (
    <div className="min-h-screen">
      <SEO />
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <ProcessSearchSection />
        <AboutSection />
        <PracticeAreasSection />
        <TeamSection />
        <LatestNewsSection />
        <ContactSection />
        <NewsletterSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  const language = resolveWpLanguage(locale);

  try {
    await queryClient.prefetchQuery(
      gqlQueryOptions(HomeQuery, {
        input: { language },
      }),
    );
  } catch (error) {
    console.warn("Retrying HomeQuery prefetch failed:", error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
};

export default Index;
