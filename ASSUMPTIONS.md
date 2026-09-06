# Assumptions & Design Decisions

The assignment asks to build the **1Fi Marketplace** inside the existing Shop
page "while maintaining consistency with the existing 1Fi app" and says to make
reasonable assumptions where the existing code/data isn't available. This file
records those assumptions and the reasoning behind them.

## 1. Technology stack — React Native + Expo (TypeScript)

**Assumption:** the 1Fi app is a React Native app.

**Why:** 1Fi's app UI (rounded cards, gradient banner, segmented controls,
floating tab bar, system-style typography) is idiomatic React Native, and RN is
the dominant stack for Indian consumer-fintech apps. React Native is therefore
the most likely way to "maintain consistency with the existing application
architecture and UI components," and this code is structured to drop into such a
codebase. Expo was used so the app runs on a real device via **Expo Go**, on an
emulator, and on the **web** for easy review — with no native build step.

The 1Fi source is proprietary/closed, so the existing Shop shell (banner, tabs,
bottom navigation) was **reproduced** from the live app and the provided
screenshots rather than imported.

## 2. Scope — Shop page only

Per the brief, **Top Brands** and **Nearby Stores** are intentionally left
unimplemented. They render a clean, on-brand placeholder rather than a broken
blank screen. The other bottom-nav tabs (Home, EMI Dues, Limit, Profile) exist
so the navigation shell is complete, and also show tasteful placeholders — they
are explicitly out of scope. The Shop page **defaults to the 1Fi Marketplace
tab** so the built feature is front and centre.

## 3. Data & APIs — mocked behind a realistic service

There is no public 1Fi product/EMI API, so:

- Product, category and user-limit data are **mock data** in `src/data/`,
  consumed **only** through `src/services/api.ts` (a mock API with simulated
  latency and optional failures) — never imported directly by UI.
- Swapping the mock service for real `fetch()` calls requires **no UI changes**.

**Catalog:** 1Fi's real marketplace centres on **premium smartphones and
laptops**. This was extended to the full electronics range (audio, wearables,
tablets, TVs, gaming, cameras) with realistic 2026-India pricing, variants,
ratings and specs, to demonstrate a complete browsing experience.

## 4. EMI model

- **No-cost EMI**: 0% interest, total payable = price, monthly = price ÷ tenure
  (from 1Fi's FAQ). Tenures offered — 3, 6, 9, 12, 18, 24, 36 months — mirror
  1Fi's published set (trimmed of the longest tenures for typical electronics
  ticket sizes).
- A plan is flagged **"recommended"** when its monthly amount is closest to an
  affordable ~₹5,000/mo, and flagged as exceeding the limit when the price is
  above the user's available headroom.

## 5. The 1Fi limit & mutual-fund lien

- The signed-in user has a mock **mutual-fund-backed limit** (₹4.23L available of
  ₹5L, from ₹10L pledged at a 50% loan-to-value). In the real app this comes from
  the pledged portfolio and lives on the **Limit** tab.
- At checkout, the **lien amount** is derived as `price ÷ LTV` and shown to the
  user, with the reassurance that units stay invested — reflecting how 1Fi
  actually works (lien-marking rather than selling units).
- These figures are illustrative, not financial advice.

## 6. Product imagery — real photos with a vector fallback

Products carry real product images sourced from **Wikimedia Commons** (freely
licensed) via each product's `images` URL. `ProductImage` shows the photo over a
**brand-tinted vector `DeviceGraphic`**, which doubles as the loading placeholder
and the fallback if a URL ever fails — so the app never shows a broken image and
still works offline. A few products with no clean Commons photo (e.g. Pixel 9
Pro, ROG Zephyrus, LG OLED C4) intentionally keep the vector graphic.

Image URLs point at `upload.wikimedia.org`; swap them for a first-party product
CDN in production. Attribution for the Commons photos remains with their
respective authors under their CC/public-domain licenses.

## 7. Networking / connectivity

React Query's online manager is configured to always allow fetching
(`networkMode: 'always'` + an online event listener) because the data source is
in-process. In a production app this is where **@react-native-community/netinfo**
would drive real connectivity, and auto-retry could be re-enabled; here, failed
requests surface an error state with a manual **Try again** action.

## 8. Order placement

Placing an order calls a mock mutation that returns a confirmation (order ID,
first-EMI date, lien amount) and invalidates the cached limit, as a real purchase
would. No real lending, KYC, or payment flow is performed.

## 9. Out of scope (deliberately)

Authentication/KYC, the actual pledge/lien flow with an RTA, real payments, order
history, and push notifications — all part of the real 1Fi product but outside
this assignment's focus on the Marketplace browsing-and-EMI experience.
