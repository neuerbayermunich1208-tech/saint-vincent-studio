# CLAUDE.md — Saint Vincent Studio

Instructions for any AI coding assistant working on this project. Read this first, then PROJECT_PLAN.md.

## The brand
- Saint Vincent Studio is an **Independent Design & Manufacturing Studio**. Domain: saintvincent.studio.
- Customers come for original design, creativity, finish quality and the experience of owning the object.
  Manufacturing technology is a tool behind the brand, never the message.
- The owner writes in Vietnamese. Reply in Vietnamese. Public site default language is English, with Vietnamese (VI) as the second locale.

## Hard rules (never break)
1. **Never use 3D-printing wording publicly**: not in copy, metadata, alt text, SEO keywords, URLs, schema, OG images or marketing.
   Banned: "3D printing service", "3D printed products", "3D print shop", "3D printing farm", "dịch vụ in 3D", "nhận in 3D", "xưởng in 3D".
   Do not show printers as brand imagery. Use: original design, precision manufacturing, product development, modular design,
   design-led manufacturing, creative engineering, thoughtfully crafted objects, contemporary craftsmanship.
2. **Logo**: use `assets/brand/saint-vincent-logo-original.png` (or its proportional resizes) exactly as provided.
   Never redraw, recolor, crop, stretch, re-letter, or replace it with text/emoji/an AI-generated mark. Place it on its own cream
   (#FDF5EA) ground; on other backgrounds show it as a cream plate. Ask the owner for vector/transparent/horizontal versions.
3. **No invented facts**: no fake specs, materials, certifications, capacity, history, customer counts, stock levels,
   limited quantities, release dates or countdowns. Use "published when the prototype is final" / "to be announced".
4. **No fake commerce**: never simulate successful orders or availability without a real backend. Forms in previews say "preview only".
5. **No paid services or production deploys without the owner's explicit approval.** Payments go through sandbox first.
6. Never commit secrets. `.env.example` lists names only.
7. Do not delete working source code without asking.

## Current phase
Phase 2 done (three previews). Waiting for the owner to pick a direction (A, B, C or a hybrid). Do not build the commerce system before that.

## Stack (planned, see ARCHITECTURE.md)
Next.js 16 App Router + TypeScript + Tailwind CSS v4 + custom tokens, Motion for animation, Payload CMS 3 (embedded in the Next app)
on PostgreSQL, S3-compatible object storage, next-intl for UI strings. Verify versions against official docs before installing.

## Workflow
- Run lint, typecheck, tests and a production build before calling work done. Screenshot desktop (1440) and mobile (390).
- Respect prefers-reduced-motion. Never lock native scrolling. No long intro loaders.
- Update CHANGELOG.md and the relevant doc whenever a design or architecture decision changes.
