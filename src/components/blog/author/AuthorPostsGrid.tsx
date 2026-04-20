import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FragmentType } from "@/graphql/__gen__/fragment-masking";
import { AuthorPostCardFragment } from "@/graphql/pages/author";
import { AuthorPostCard } from "./AuthorPostCard";

interface AuthorPostsGridProps {
  posts: FragmentType<typeof AuthorPostCardFragment>[];
  isLoading?: boolean;
}

/**
 * AuthorPostsGrid - Organism component
 * Displays a grid of author posts with loading state
 * Composes AuthorPostCard molecules
 */
export function AuthorPostsGrid({ posts, isLoading }: AuthorPostsGridProps) {
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

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Este autor ainda não publicou nenhum artigo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <AuthorPostCard key={index} post={post} />
      ))}
    </div>
  );
}
