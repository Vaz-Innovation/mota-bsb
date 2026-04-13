

## Plan: Create "/avalie" page and add footer link

### New page: `src/pages/Avalie.tsx`
- Hero section with title "Sua opinião é importante" and subtitle about legal services
- 5 orange stars (using lucide-react `Star` icon, filled orange)
- "Avalie Nossa Experiência" heading
- Subtitle about sharing experience on Google
- Info card with emoji and text about how reviews help improve services
- Navy blue CTA button "Deixar Avaliação" with star icon and external link icon, linking to `https://share.google/1EuNfdFzLLHbqCPWT` (opens in new tab)
- Small text below: "Você será redirecionado para o Google Meu Negócio"
- Includes Header and Footer

### Route: `src/App.tsx`
- Import `Avalie` and add `<Route path="/avalie" element={<Avalie />} />`

### Footer link: `src/components/Footer.tsx`
- Add "Avalie-nos" to `quickLinks` array pointing to `/avalie`

