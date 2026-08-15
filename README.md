<div align="center">

# 🍫 La Miette Brownie
### Artisanal Luxury Dessert Boutique & Cake Studio

[![Live Demo](https://img.shields.io/badge/🌐_Live_Website-lamiettebrownie.me-D9A441?style=for-the-badge&logoColor=white&labelColor=221B12)](https://www.lamiettebrownie.me)
[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![GSAP](https://img.shields.io/badge/GSAP_3-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Lenis Scroll](https://img.shields.io/badge/Lenis-Smooth_Scroll-E8AB48?style=for-the-badge)](https://lenis.darkroom.engineering/)
[![Upstash Redis](https://img.shields.io/badge/Upstash_Redis-00E599?style=for-the-badge&logo=redis&logoColor=white)](https://upstash.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br />

**A state-of-the-art, Michelin-grade interactive digital experience crafted for Dhaka's premier artisanal dessert house.**  
Handcrafting intensely rich Belgian chocolate brownies, molten Basque burnt cheesecakes, and NYC-style chunky cookies.

[Explore Menu](https://www.lamiettebrownie.me/#products) • [Our Artisan Story](https://www.lamiettebrownie.me/#process) • [Order Online](https://www.lamiettebrownie.me)

---

</div>

## 🌟 Executive Highlights

- **✨ Royal Brand Identity**: Bespoke typography with Fraunces serif, 24K gold ambient accents, and crystal-clear vector branding.
- **🧈 120 FPS Butter-Smooth Motion**: Lenis smooth scroll engine unified with GSAP ScrollTrigger and Framer Motion micro-interactions.
- **🛍️ Seamless Shopping & Checkout**: Interactive client-side shopping bag with real-time subtotal computation, pickup schedule selections, and order tracking.
- **💳 Multi-Channel Payment Suite**: Integrated checkout flow supporting bKash, Nagad, SSLCommerz sandbox, and Cash on Pickup.
- **⚡ Edge Performance & Redis Caching**: Sub-second TTFB powered by Next.js 15 App Router and Upstash Redis distributed cache.
- **🔍 Full-Spectrum SEO Engine**: JSON-LD schema markup (`Bakery` / `LocalBusiness`), OpenGraph 1200x630 previews, dynamic `sitemap.xml`, and Google Search Console verification.
- **♿ WCAG 2.2 AA Accessibility**: Full keyboard navigation support, high-contrast states, and system-level `prefers-reduced-motion` compliance.

---

## 🛠️ Technology Stack

| Category | Technologies & Tools |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Components & Route Handlers) |
| **UI Library** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Variable Design Tokens |
| **Motion & Physics** | [Framer Motion](https://www.framer.com/motion/) + [GSAP 3](https://greensock.com/gsap/) + [Lenis Smooth Scroll](https://lenis.darkroom.engineering/) |
| **Icons & Assets** | [Lucide React](https://lucide.dev/) + Handcrafted SVG Brand Monograms |
| **State & Storage** | React Context + LocalStorage + [Upstash Redis](https://upstash.com/) |
| **Analytics & Web Vitals** | [@vercel/analytics](https://vercel.com/analytics) + [@vercel/speed-insights](https://vercel.com/docs/speed-insights) |
| **Hosting & CI/CD** | [Vercel Edge Network](https://vercel.com/) |

---

## 📂 Project Architecture

```bash
bekary/
├── 📁 app/
│   ├── 📄 layout.tsx             # Root layout with JSON-LD, Fonts & SEO metadata
│   ├── 📄 page.tsx               # Interactive flagship landing page
│   ├── 📄 globals.css            # Master typography, color tokens & GPU animations
│   ├── 📄 manifest.ts            # PWA Web App Manifest
│   ├── 📄 robots.ts              # Search engine crawler instructions
│   ├── 📄 sitemap.ts             # Dynamic XML sitemap generator
│   └── 📁 api/
│       └── 📁 checkout/          # Serverless checkout & order handlers
├── 📁 components/
│   ├── 📁 layout/
│   │   ├── 📄 Navbar.tsx         # Responsive glassmorphism navigation header
│   │   ├── 📄 Footer.tsx         # Brand footer with quick links & policies
│   │   ├── 📄 Preloader.tsx      # GPU-accelerated entrance loader
│   │   └── 📄 SmoothScroll.tsx   # Lenis wrapper integration
│   ├── 📁 sections/
│   │   ├── 📄 Hero.tsx           # Cinematic video hero showcase
│   │   ├── 📄 SignatureCollection.tsx
│   │   ├── 📄 FeaturedProducts.tsx
│   │   ├── 📄 ArtisanProcess.tsx
│   │   ├── 📄 FreshBake.tsx
│   │   ├── 📄 SeasonalCollection.tsx
│   │   └── 📄 Testimonials.tsx
│   └── 📁 ui/                    # Reusable atomic UI elements
├── 📁 context/
│   └── 📄 CartContext.tsx        # Global shopping bag state provider
├── 📁 hooks/
│   └── 📄 useLenis.ts            # 60/120fps Lenis smooth scroll hook
├── 📁 lib/
│   ├── 📄 constants.ts           # Product catalogue & pricing data
│   └── 📄 redis.ts               # Upstash Redis caching client
└── 📁 public/
    ├── 📄 favicon.svg            # 24K Gold LM crest icon
    └── 📄 googlebbcc83711ac69414.html # Google Search Console verification
```

---

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/shahriyarcse-arch/La-Miette-Brownie.git
cd La-Miette-Brownie
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy

- **Zero Client Telemetry Leakage**: All customer order details and session bags are securely processed.
- **XSS & Injection Protection**: Inputs are thoroughly sanitized prior to database persistence.
- **SSL / HTTPS Enforced**: Full HTTPS transport encryption via Vercel Edge.

---

## 📜 License & Copyright

© 2026 **La Miette Brownie**. All Rights Reserved.  
Crafted with passion for culinary excellence in Dhaka, Bangladesh.
