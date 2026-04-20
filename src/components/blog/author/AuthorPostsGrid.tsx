import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FragmentType,
  useFragment,
} from "@/graphql/__gen__/fragment-masking";
import { AuthorPostCardFragment } from "@/graphql/pages/author";
import { AuthorPostCard } from "./AuthorPostCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthorPostsGridProps {
  posts: FragmentType<typeof AuthorPostCardFragment>[];
  isLoading?: boolean;
  searchTerm?: string;
  selectedCategory?: string;
}

/**
 * AuthorPostsGrid - Organism component
 * Displays a grid of author posts with loading state and filtering
 * Composes AuthorPostCard molecules
 */
export function AuthorPostsGrid({
  posts,
  isLoading,
  searchTerm = "",
  selectedCategory,
}: AuthorPostsGridProps) {
  const { t } = useLanguage();

  // Extract fragment data for filtering
  const postsWithData = useMemo(() => {
    return posts.map((post) => ({
      fragment: post,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      data: useFragment(AuthorPostCardFragment, post),
    }));
  }, [posts]);

  // Filter posts by search term and category
  const filteredPosts = useMemo(() => {
    return postsWithData.filter(({ data }) => {
      const matchesSearch =
        searchTerm === "" ||
        (data.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (data.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);

      const matchesCategory =
        !selectedCategory ||
        data.categories?.nodes?.some((cat) => cat.slug === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [postsWithData, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg" />
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          {searchTerm || selectedCategory
            ? t("blog.no_results")
            : "Este autor ainda não publicou nenhum artigo."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPosts.map(({ fragment }, index) => (
        <AuthorPostCard key={index} post={fragment} />
      ))}
    </div>
  );
}
