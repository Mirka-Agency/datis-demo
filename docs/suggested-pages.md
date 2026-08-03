# Suggested Pages — Agrochemical Factory & Supplier Website

Inventory of pages for the Datis (داتیس) site beyond the current one-page landing (`index.html`).

**Priority legend**

| Tag | Meaning |
|-----|---------|
| P0 | Core — build first for a usable multi-page site |
| P1 | Important — sales, trust, SEO |
| P2 | Nice to have — deepen authority & conversion |
| P3 | Later / optional |

**Status**

| Tag | Meaning |
|-----|---------|
| Done | Static HTML template exists |
| Landing section | Exists as a section on homepage |
| TODO | Needs a dedicated page template |

---

## 1. Products & catalog

| Page | Suggested path | Priority | Status | Notes |
|------|----------------|----------|--------|-------|
| Product listing / catalog | `/products.html` | P0 | Done | Root HTML |
| Product detail | `/product-details.html` | P0 | Done | SEO content, related products/crops/knowledge, comments, quote & consult modals |
| Product family / category | `/product-category.html` | P0 | Done | SEO intro + filter + pagination; sample water-soluble family |
| Catalog download | `/downloads.html#catalog` | P1 | Done | Merged into downloads (PDF: `assets/catalog.pdf`) |
| Compare products | `/products-compare.html` | P3 | TODO | Side-by-side specs |

---

## 2. Knowledge / tutorials (آموزش)

| Page | Suggested path | Priority | Status | Notes |
|------|----------------|----------|--------|-------|
| Knowledge hub | `/knowledge.html` | P0 | Done | Methods, crops, and articles in one hub |
| Tutorial / article detail | `/knowledge-details.html` | P0 | Done | Unified guide: crop/method sections + video library (`#videos`) |
| Video library | `/knowledge-details.html#videos` | P1 | Done | Merged into knowledge-details (no separate page) |
| FAQ (nutrition & products) | `/faq.html` | P1 | Done | Flat single page |
| Dosage / application guides | `/knowledge-guides.html` | P2 | TODO | Practical field guides |
| Glossary | `/knowledge-glossary.html` | P3 | TODO | Agrochemical terms |

---

## 3. Blog / news / events

| Page | Suggested path | Priority | Status | Notes |
|------|----------------|----------|--------|-------|
| Blog / news listing | `/blog.html` | P0 | Done | Root HTML |
| Blog post detail | `/blog-details.html` | P0 | Done | Rich sample: SEO, sidebar, comments, prev/next |
| Events listing | `/events.html` | P0 | Done | Root HTML |
| Event detail | `/event-details.html` | P0 | Done | Sample event page with gallery + optional video |
| Press / media | `/press.html` | P2 | TODO | Press releases, logos, kit |

---

## 4. Sales & commercial

| Page | Suggested path | Priority | Status | Notes |
|------|----------------|----------|--------|-------|
| Partnership (distributor / sales rep / B2B) | `/partnership.html` | P0 | Done | Unified long-form + form; prefill `?type=distributor\|sales-rep\|b2b` |
| Find a distributor / dealer map | `/distributors.html` | P1 | Done | Static directory + Iran map filter |
| Request consultation / quote | `/consultation.html` | P1 | Done | One form; subject select (مشاوره / قیمت). Prefill: `?subject=quote` |
| Export / international sales | `/export.html` | P2 | TODO | Markets, Incoterms, contact |
| Tender / procurement | `/tenders.html` | P3 | TODO | For large institutional buyers |

---

## 5. Company & trust

| Page | Suggested path | Priority | Status | Notes |
|------|----------------|----------|--------|-------|
| About us | `/about.html` | P0 | Done | Includes factory (`#factory`) and quality (`#quality`) |
| R&D / innovation | `/rd.html` | P2 | TODO | Formulations, trials |
| Sustainability / ESG | `/sustainability.html` | P2 | TODO | Environment, safe use |
| Careers | `/careers.html` | P2 | TODO | Jobs listing |
| Job detail | `/careers-[slug].html` | P2 | TODO | Apply form |
| Leadership / team | `/about-team.html` | P3 | TODO | Optional |

---

## 6. Contact & support

| Page | Suggested path | Priority | Status | Notes |
|------|----------------|----------|--------|-------|
| Contact | `/contact.html` | P0 | Done | HQ + factory + support (`#support`) + maps, socials, form |
| Branches / offices | `/contact-branches.html` | P2 | TODO | Regional offices |
| Complaint / feedback | `/feedback.html` | P3 | TODO | After-sales |

---

## 7. Documents & compliance (agrochemical-specific)

| Page | Suggested path | Priority | Status | Notes |
|------|----------------|----------|--------|-------|
| Downloads center | `/downloads.html` | P1 | Done | Catalog + SDS (`#sds`) + TDS (`#tds`) |
| Labels / packaging info | `/downloads-labels.html` | P2 | TODO | |
| Registrations & licenses | `/compliance.html` | P2 | TODO | Official product registrations |
| Safe use & storage | `/safety.html` | P2 | TODO | Farmer-facing safety content |

---

## 8. Legal & utility

| Page | Suggested path | Priority | Status | Notes |
|------|----------------|----------|--------|-------|
| Privacy policy | `/privacy.html` | P1 | Done | Flat single page |
| Terms of use | `/terms.html` | P1 | Done | Flat single page |
| Cookie notice (if needed) | — | P3 | TODO | |
| Sitemap (HTML) | `/sitemap.html` | P3 | Done | Plain table of all pages by priority |
| 404 | `/404.html` | P1 | Done | Root `404.html` |
| Search results | `/search.html` | P2 | TODO | Products + articles |

---

## 9. Campaign / landing (optional)

| Page | Suggested path | Priority | Status | Notes |
|------|----------------|----------|--------|-------|
| Seasonal campaign | `/campaigns-[slug].html` | P2 | TODO | Short landing + CTA |
| Webinar registration | `/webinars-[slug].html` | P2 | TODO | Can reuse event detail |
| Newsletter archive | `/newsletter.html` | P3 | TODO | |

---

## Implementation notes (P0 + P1 pass)

- Shared chrome is **duplicated** in each HTML file (navbar, footer, consult modal).
- All HTML pages are in the **site root** (flat filenames like `products.html`, `knowledge-details.html`).
- Relative asset paths: `assets/`, `css/`, `js/` (same folder as pages).
- Optional regenerator: `node scripts/generate-pages.mjs`
- P2/P3 remain TODO.

---

## Checklist

- [x] Blog (listing + detail)
- [x] Product (listing + detail)
- [x] Events (listing + detail)
- [x] Knowledge / tutorials (hub + detail)
- [x] Partnership page (distributor / sales rep / B2B)
- [x] Other P0/P1 pages from tables above
- [ ] P2/P3 pages (later)
