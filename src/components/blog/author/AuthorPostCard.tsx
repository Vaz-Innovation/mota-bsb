import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFragment, FragmentType } from "@/graphql/__gen__/fragment-masking";
import { AuthorPostCardFragment } from "@/graphql/pages/author";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthorPostCardProps {
  post: FragmentType<typeof AuthorPostCardFragment>;
}

/**
 * AuthorPostCard - Molecule component
 * Displays a single post card in the author's posts grid
 * Uses AuthorPostCardFragment for type-safe GraphQL data
 */
export function AuthorPostCard({ post: postFragment }: AuthorPostCardProps) {
  const post = useFragment(AuthorPostCardFragment, postFragment);
  const { t } = useLanguage();

  return (
    <article>
      <Link href={`/blog/${post.slug}`}>
        <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
          {post.featuredImage?.node?.sourceUrl && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || post.title || ""}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {post.categories?.nodes?.[0] && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  {post.categories.nodes[0].name}
                </Badge>
              )}
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-lg group-hover:text-accent transition-colors line-clamp-2">
              {post.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.date &&
                  format(new Date(post.date), "d 'de' MMMM, yyyy", {
                    locale: ptBR,
                  })}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {post.excerpt && (
              <div
                className="text-muted-foreground text-sm line-clamp-3 mb-4"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}
            <div className="flex items-center text-accent text-sm font-medium">
              {t("blog.read_more")} <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </article>
  );
}
