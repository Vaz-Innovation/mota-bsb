## Plan: Mota BSB Next.js + WordPress GraphQL Migration

Migrate mota-bsb from React+Vite SPA to Next.js Pages Router, adopting the GraphQL architecture proven in mota-poa, manuel-antunes, and vazinnovation (codegen + typed documents + gqlpc + execute + fragments-as-props), while removing Supabase/Auth and using WordPress as the single source of truth.

**Steps**

1. Phase 1: Baseline and dependency transition
   1.1 Capture current behavior and route inventory from `src/App.tsx`.
   1.2 Replace Vite runtime/tooling with Next.js Pages Router tooling in `package.json`.
   1.3 Remove Vite-only config usage.
   1.4 Add Next foundational configs (`next.config.js`, TypeScript/Lint updates).
   1.5 Initialize `codegen.ts`.

2. Phase 2: GraphQL framework bootstrap
   2.1 Create `src/graphql` structure.
   2.2 Add `.graphqlrc.yaml`.
   2.3 Port `execute.ts` and `gqlpc.ts` transport logic.
   2.4 Add `pages/api/wordpress/graphql.ts` proxy.
   2.5 Add `localeToWpLanguage` helper.
   2.6 Add codegen scripts and dependencies.

3. Phase 3: WordPress query/mutation contract design
   3.1 Define blog read operations (list, slug, categories, tags).
   3.2 Define subscriber mutation path.
   3.3 Map Supabase fields to WordPress schema.
   3.4 Introduce shared fragments.

4. Phase 4: Route migration to Next Pages Router
   4.1 Implement Next pages: `/`, `/blog`, `/blog/[slug]`, `/avalie`, `/trabalhe-conosco`, `404`.
   4.2 Use `getStaticProps`, `getStaticPaths`, and ISR.
   4.3 Move SEO handling to page-level metadata.

5. Phase 5: Component architecture refactor
   5.1 Refactor components to use fragments-as-props.
   5.2 Replace `<img>` with Next.js `<Image />`.
   5.3 Consolidate design patterns (Tailwind + CSS).

6. Phase 6: Supabase/Auth removal
   6.1 Remove all auth UI and route guards.
   6.2 Remove Supabase client/types.
   6.3 Remove custom admin CMS surface.

7. Phase 7: Build hardening and acceptance validation
   7.1 Enforce `gen` -> typecheck -> `build` pipeline.
   7.2 Validate all routes and dynamic slugs.
   7.3 Validate subscriber mutation.

8. Phase 8: SEO & Metadata Optimization
   8.1 Implement centralized `SEO` component.
   8.2 Add Open Graph, JSON-LD, and Canonical tags.

9. Phase 9: Multi-Language Strategy & URL Localization
   9.1 Enable Next.js `i18n`.
   9.2 Synchronize `LanguageContext` with router locale.
   9.3 Implement `localePathOverrides` for language switching.
   9.4 Ensure `hreflang` alternates in `SEO`.

**Verification**
- `npm run gen` succeeded.
- `npm run build` succeeded.
- All routes functional across locales.
- No Supabase/Vite leftovers.
