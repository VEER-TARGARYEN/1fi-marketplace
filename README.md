# 1Fi Marketplace

A new **1Fi Marketplace** section built into the existing **Shop** page of the
[1Fi](https://1fi.in) app — browse premium electronics and buy them on
**mutual-fund-backed no-cost EMI**, matching 1Fi's existing UI, navigation and
overall experience.

> **1Fi in one line:** the world's first mutual-fund-backed no-cost EMI platform.
> You pledge your mutual fund units, an RBI-regulated lender pays the merchant,
> and you repay the principal in EMIs — **0% interest, no credit score, prepay
> anytime.** The Marketplace is where that credit line gets spent.

Built for the **1Fi SDE Intern assignment**.

<p align="center"><em>React Native · Expo · TypeScript · React Navigation · TanStack Query</em></p>

---

## Table of contents

- [What was built](#what-was-built)
- [Product understanding](#product-understanding-why-it-looks-like-this)
- [Running the app](#running-the-app)
- [Architecture](#architecture)
- [Data & API layer](#data--api-layer)
- [State management](#state-management)
- [UI / UX consistency](#ui--ux-consistency)
- [Loading, empty & error states](#loading-empty--error-states)
- [Responsiveness](#responsiveness)
- [How this maps to the evaluation criteria](#how-this-maps-to-the-evaluation-criteria)
- [Assumptions](#assumptions)
- [Project structure](#project-structure)

---

## What was built

The **Shop** page has the three required options:

| Tab | Status |
| --- | --- |
| **Top Brands** | Intentionally blank (clean placeholder), per the assignment |
| **Nearby Stores** | Intentionally blank (clean placeholder), per the assignment |
| **1Fi Marketplace** | **Fully designed & implemented** |

The Marketplace delivers the full journey requested in the brief and then some:

- **Product listing** — responsive grid with image, name, brand, rating, price,
  discount, and the headline "No Cost EMI from ₹X/mo".
- **Search** (debounced), **category filter** chips, and **sort** (featured,
  price, rating, lowest EMI) via a bottom sheet.
- **Your 1Fi limit** strip — the mutual-fund-backed purchase power that funds
  every EMI, with a used/available bar and trust signals.
- **Product detail** — image, name, pricing (with MRP + discount), **variants**
  (colour swatches + storage/RAM/size chips that update price and the product
  graphic), highlights, specs, and a "Why 1Fi" reassurance card.
- **EMI plans** — selectable no-cost plans across 1Fi's real tenures
  (3–36 months), each showing the monthly amount, total payable, a recommended
  option, and a warning if a plan exceeds the available limit.
- **CTA to proceed** — a sticky bar carrying the selected plan into…
- **Checkout** — order summary, EMI breakdown, and the **mutual-fund lien /
  limit impact** ("we'll lien-mark ₹X of your mutual funds; your units stay
  invested"), with a confirm action that places the order.
- **Order confirmation** — animated success screen with the order + EMI summary.

Plus the details that make it feel real: **wishlist** (persisted), **loading
skeletons**, **empty & error states**, **pull-to-refresh**, press feedback,
haptics-ready interactions, and a **responsive grid** (2 → 3 → 4 columns).

## Product understanding (why it looks like this)

The whole experience is designed around 1Fi's actual value proposition rather
than being a generic e-commerce clone:

- Every product leads with **"No Cost EMI from ₹X/mo"**, not just a price.
- The **1Fi limit strip** anchors the page — you're shopping against *your
  investments*, so the app makes that headroom and its backing explicit.
- Checkout surfaces the **lien on mutual funds** and the **limit impact**, which
  is exactly what makes 1Fi different from a credit card.
- Copy throughout reinforces **0% interest · no credit check · prepay anytime**,
  straight from 1Fi's own messaging.
- The catalog centres on **premium smartphones & laptops** (1Fi's real focus),
  extended to the full electronics range.

## Running the app

**Prerequisites:** Node 18+ and npm.

```bash
npm install
npx expo start
```

Then:

- **On your phone** — install **Expo Go** and scan the QR code (best way to see
  it as a real Android app).
- **Web preview** — press `w` in the terminal, or run `npm run web`, then open
  the printed `localhost` URL.
- **Android emulator** — press `a` (requires Android Studio).

> Tip: to preview the **loading / error states**, set `errorRate` to `1` in
> [`src/services/api.ts`](src/services/api.ts) and reload.

## Architecture

A clean separation of concerns so the feature drops into a real codebase and the
data source can be swapped without touching the UI:

```
UI (screens + components)
        │  hooks only
        ▼
Data hooks (TanStack Query)   ← useProducts, useProduct, useCategories,
        │  call the service       useUserLimit, usePlaceOrder
        ▼
Service layer (mock API)      ← the ONLY module that reads raw data;
        │  swap for fetch()       simulates latency + failures
        ▼
Mock data (JSON-like TS)      ← products, categories, user limit
```

- **Components never import data.** They receive it through hooks, which call the
  service. Replacing the service bodies with `fetch()` calls is the entire
  backend integration — no UI changes.
- **Design tokens** (`src/theme`) centralise colour, spacing, typography, radii
  and shadows, so the Marketplace stays visually consistent with the rest of 1Fi.
- **Reusable primitives** (`Text`, `Button`, `Card`, `Badge`, `Skeleton`,
  `SearchBar`, `SectionHeader`, `ErrorState`, `EmptyState`, …) are composed into
  marketplace-specific components (`ProductCard`, `EmiPlanSelector`,
  `VariantSelector`, `LimitStrip`, …).

## Data & API layer

Per the brief, **no product/EMI data is hardcoded into UI components**. Instead:

- Raw mock data lives in [`src/data`](src/data) and is imported **only** by the
  service.
- [`src/services/api.ts`](src/services/api.ts) is a mock API that mimics a real
  network boundary — artificial latency, optional failures (`errorRate`), and
  server-side filtering/sorting — so the app behaves exactly as it would against
  a backend.
- EMI math lives in [`src/utils/emi.ts`](src/utils/emi.ts): no-cost plans are
  derived from price + tenure, and each plan is checked against the user's
  available limit.

To go live, replace each service function body with a real `fetch()` — the types,
hooks and UI stay untouched.

## State management

- **Server state** → **TanStack Query**: caching, `staleTime`, `placeholderData`
  (keeps the current list visible while refetching), pull-to-refresh, and a
  mutation for placing orders that invalidates the user's limit on success.
- **Local UI state** → React state/hooks: variant selection and derived price
  (`useProductConfiguration`), search/category/sort, selected EMI plan.
- **Persisted state** → **AsyncStorage** via a `WishlistProvider` context.

Centralised query keys ([`src/hooks/queryKeys.ts`](src/hooks/queryKeys.ts)) keep
caching and invalidation consistent.

## UI / UX consistency

Reproduced faithfully from the live 1Fi Shop page: the deep-violet **gradient
banner** ("Shop today, Pay later using Mutual funds"), the **segmented tab
control**, rounded white cards with soft shadows, the light-lavender accent
system, and the **floating bottom navigation** (Home · Shop · EMI Dues · Limit ·
Profile) with its purple active indicator. Typography uses **Inter** across a
single type scale.

## Loading, empty & error states

- **Loading** — shimmering skeletons that mirror the real card layout (no blank
  flash, no layout shift).
- **Empty** — friendly "no products found" when a search/filter returns nothing.
- **Error** — a clear message with a **Try again** action on every data view;
  each mock request can fail independently for testing.

## Responsiveness

- The product grid adapts: **2 columns** on phones, **3** on large phones/tablets,
  **4** on wide screens, with card widths computed to fill the row exactly.
- Safe-area insets are respected top and bottom; the banner extends under the
  status bar while content stays clear of it.
- Long content scrolls inside its own container; sticky CTAs sit above the safe
  area.

## How this maps to the evaluation criteria

| Criterion | Where to look |
| --- | --- |
| **Product understanding** | Limit strip, lien/limit impact at checkout, no-cost-EMI-first framing |
| **UI/UX consistency** | `src/components/shop`, `src/theme`, `CustomTabBar` |
| **Engineering quality** | Layered architecture, typed domain model, reusable components |
| **Functionality** | Browse → variants → EMI plan → checkout → confirm, all working |
| **Data/API implementation** | `src/services/api.ts`, `src/hooks/*`, no hardcoded UI data |
| **Attention to detail** | Skeletons, error/empty states, responsiveness, animations, a11y labels |

## Assumptions

See [ASSUMPTIONS.md](ASSUMPTIONS.md) for the full list. In short: 1Fi's app is
treated as **React Native** (the natural fit for its UI); its source isn't
public, so the Shop shell was reproduced from the live app and screenshots, and
product/EMI/limit data is mocked behind a realistic API.

## Project structure

```
src/
  components/
    common/        Text, Button, Card, Badge, Skeleton, SearchBar, ErrorState, …
    marketplace/   ProductCard, EmiPlanSelector, VariantSelector, LimitStrip,
                   DeviceGraphic, ProductImage, CategoryChips, SortSheet, …
    shop/          ShopBanner, SegmentedTabs, BannerArt
  data/            products, categories, user (mock sources — service-only)
  hooks/           useProducts, useCategories, useUserLimit, usePlaceOrder,
                   useProductConfiguration, useWishlist, useDebouncedValue
  navigation/      RootNavigator, BottomTabs, CustomTabBar, types
  screens/
    shop/          ShopScreen, MarketplaceTab, BlankShopTab, ShopHeader
    marketplace/   ProductDetail, Checkout, OrderSuccess
    PlaceholderScreen
  services/        api (mock API), queryClient
  theme/           colors, typography, tokens, shadows
  types/           domain model
  utils/           format (₹), emi, color, layout, animation
```

---

<sub>Built with care for the 1Fi SDE Intern assignment. Product imagery uses
brand-tinted vector graphics so the app is fully self-contained and offline
capable; real image URLs drop into `product.images` and take over automatically.</sub>
