import Image from "next/image";
import { Mail } from "lucide-react";
import { useFragment, FragmentType } from "@/graphql/__gen__/fragment-masking";
import { AuthorCardFragment } from "@/graphql/pages/author";

interface AuthorHeaderProps {
  author: FragmentType<typeof AuthorCardFragment>;
}

/**
 * AuthorHeader - Molecule component
 * Displays author avatar, name, description and email link
 * Uses AuthorCardFragment for type-safe GraphQL data
 */
export function AuthorHeader({ author: authorFragment }: AuthorHeaderProps) {
  const author = useFragment(AuthorCardFragment, authorFragment);

  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {author.avatar?.url && (
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg ring-4 ring-accent/20 flex-shrink-0">
            <Image
              src={author.avatar.url}
              alt={author.name || "Avatar do autor"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 96px, 128px"
            />
          </div>
        )}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {author.name}
          </h1>
          {author.description && (
            <p className="text-muted-foreground max-w-2xl mb-4">
              {author.description}
            </p>
          )}
          {author.email && (
            <a
              href={`mailto:${author.email}`}
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
            >
              <Mail className="h-4 w-4" />
              {author.email}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
