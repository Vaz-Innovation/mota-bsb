import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface Category {
  id: string;
  name?: string | null;
  slug?: string | null;
  count?: number | null;
}

interface AuthorFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | undefined;
  onCategoryChange: (slug: string | null) => void;
  categories: Category[];
}

/**
 * AuthorFilters - Molecule component
 * Search input and category filter for author posts
 * Reusable filter controls following the blog pattern
 */
export function AuthorFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: AuthorFiltersProps) {
  const { t } = useLanguage();

  return (
    <section className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("blog.search_placeholder")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) =>
              onCategoryChange(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full md:w-[240px]">
              <SelectValue placeholder={t("blog.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("blog.all")}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug || ""}>
                  {category.name} ({category.count || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
