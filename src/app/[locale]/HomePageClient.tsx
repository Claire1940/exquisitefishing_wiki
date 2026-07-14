"use client";

import { useState, Suspense, lazy } from "react";
import {
  Anchor,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Coins,
  Compass,
  ExternalLink,
  Fish,
  Gauge,
  Gem,
  Gift,
  Hammer,
  Images,
  Map as MapIcon,
  Route,
  Ship,
  Sparkles,
  Target,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.exquisitefishing.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Exquisite Fishing Wiki",
        description:
          "Exquisite Fishing Wiki with a complete walkthrough, fish list, biome depths, gear and bait upgrades, character routes, scene requirements, and save help.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Exquisite Fishing - Pixel Fishing Adventure",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Exquisite Fishing Wiki",
        alternateName: "Exquisite Fishing",
        url: siteUrl,
        description:
          "Exquisite Fishing Wiki resource hub for walkthrough, fish, biomes, gear, bait, characters, scenes, and save guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Exquisite Fishing Wiki - Pixel Fishing Adventure",
        },
        sameAs: [
          "https://store.steampowered.com/app/2146300/Exquisite_Fishing/",
          "https://phracassado.itch.io/exquisite-fishing",
          "https://x.com/PinkySoulOG",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Exquisite Fishing",
        gamePlatform: ["PC", "Steam"],
        applicationCategory: "Game",
        genre: ["Fishing", "Adventure", "Pixel Art", "Indie"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        datePublished: "2023-10-24",
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/2146300/Exquisite_Fishing/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Exquisite Fishing GAMEPLAY",
        description:
          "Exquisite Fishing gameplay video showing the fishing loop, catches, gear upgrades, and ocean exploration.",
        uploadDate: "2023-10-24",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/r1aja9_vSdg",
        url: "https://www.youtube.com/watch?v=r1aja9_vSdg",
      },
    ],
  };

  // Accordion states
  const [baitsExpanded, setBaitsExpanded] = useState<number | null>(null);
  const [scenesExpanded, setScenesExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tools Grid 卡片 -> section id 映射（8 张卡片对应 8 个模块锚点）
  const toolsSectionIds = [
    "beginner-guide",
    "complete-walkthrough",
    "fish-and-creatures",
    "gear-and-upgrades",
    "ocean-biomes-and-depths",
    "baits-and-catch-requirements",
    "money-and-shop-guide",
    "all-scenes-and-gallery-unlocks",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/2146300/Exquisite_Fishing/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域（容器上限 max-w-5xl，避免挤压广告）*/}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="r1aja9_vSdg"
              title="Exquisite Fishing GAMEPLAY"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（视频区之后、Latest Updates 之前）*/}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = toolsSectionIds[index];
              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(sectionId);
                  }}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section（Tools Grid 之后；内容为空时组件自动隐藏）*/}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">{t.modules.exquisiteFishingBeginnerGuide.eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.exquisiteFishingBeginnerGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.exquisiteFishingBeginnerGuide.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
              {t.modules.exquisiteFishingBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.exquisiteFishingBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-2">
                      {step.details}
                    </p>
                    <p className="text-sm flex items-start gap-2 text-[hsl(var(--nav-theme-light))]">
                      <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{step.goal}</span>
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Complete Walkthrough */}
      <section id="complete-walkthrough" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Compass className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">{t.modules.exquisiteFishingCompleteWalkthrough.eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.exquisiteFishingCompleteWalkthrough.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.exquisiteFishingCompleteWalkthrough.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
              {t.modules.exquisiteFishingCompleteWalkthrough.intro}
            </p>
          </div>

          {/* Ocean Stages */}
          <div className="scroll-reveal space-y-4 md:space-y-6">
            {t.modules.exquisiteFishingCompleteWalkthrough.stages.map(
              (stage: any, index: number) => (
                <div
                  key={index}
                  className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-[hsl(var(--nav-theme))] text-white text-sm font-bold">
                      {stage.step}
                    </span>
                    <h3 className="text-lg md:text-2xl font-bold">{stage.area}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center gap-1">
                      <Ship className="w-3 h-3" /> {stage.access}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center gap-1">
                      <Coins className="w-3 h-3" /> {stage.cost}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center gap-1">
                      <Gauge className="w-3 h-3" /> {stage.depthRange}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
                    {stage.targets.map((tgt: any, ti: number) => (
                      <div
                        key={ti}
                        className="p-3 bg-white/5 border border-border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm flex items-center gap-1">
                            <Fish className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                            {tgt.name}
                          </span>
                          <span className="text-xs text-[hsl(var(--nav-theme-light))] font-medium flex items-center gap-1">
                            <Gem className="w-3 h-3" /> {tgt.value}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                          <Gauge className="w-3 h-3" /> {tgt.depth}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Anchor className="w-3 h-3" /> {tgt.requirements}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Route className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                    <span>{stage.progressionGoal}</span>
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Fish and Creatures List (table) */}
      <section id="fish-and-creatures" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Fish className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">{t.modules.exquisiteFishingFishAndCreatures.eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.exquisiteFishingFishAndCreatures.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.exquisiteFishingFishAndCreatures.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
              {t.modules.exquisiteFishingFishAndCreatures.intro}
            </p>
          </div>

          {/* Catch Table */}
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.15)] text-left">
                  {t.modules.exquisiteFishingFishAndCreatures.columns.map(
                    (col: string, ci: number) => (
                      <th
                        key={ci}
                        className="px-3 py-3 font-semibold whitespace-nowrap text-[hsl(var(--nav-theme-light))]"
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {t.modules.exquisiteFishingFishAndCreatures.rows.map(
                  (row: any, ri: number) => (
                    <tr
                      key={ri}
                      className="border-t border-border hover:bg-white/5 transition-colors"
                    >
                      <td className="px-3 py-2.5 font-medium whitespace-nowrap flex items-center gap-1.5">
                        <Fish className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                        {row.creature}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{row.ocean}</td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{row.depth}</td>
                      <td className="px-3 py-2.5 text-[hsl(var(--nav-theme-light))] font-medium whitespace-nowrap">{row.value}</td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{row.hook}</td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{row.gift}</td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                          {row.type}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 4: Gear and Upgrades (progression-table) */}
      <section id="gear-and-upgrades" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Hammer className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">{t.modules.exquisiteFishingGearAndUpgrades.eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.exquisiteFishingGearAndUpgrades.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.exquisiteFishingGearAndUpgrades.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
              {t.modules.exquisiteFishingGearAndUpgrades.intro}
            </p>
          </div>

          {/* Equipment grouped by category */}
          <div className="scroll-reveal space-y-6 md:space-y-8">
            {(["Boat", "Hook", "Gift"] as const).map((cat) => {
              const groupItems = t.modules.exquisiteFishingGearAndUpgrades.items.filter(
                (it: any) => it.category === cat,
              );
              if (groupItems.length === 0) return null;
              const catIcon = cat === "Boat" ? Ship : cat === "Hook" ? Anchor : Gift;
              const CatIcon = catIcon;
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <CatIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <h3 className="text-xl md:text-2xl font-bold">
                      {t.modules.exquisiteFishingGearAndUpgrades.categoryLabels[cat]}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {groupItems.map((item: any, ii: number) => (
                      <div
                        key={ii}
                        className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                          <h4 className="font-bold text-base md:text-lg">{item.item}</h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                            {item.progressionStage}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.documentedUse}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 text-[hsl(var(--nav-theme-light))]">
                            <Coins className="w-3 h-3" /> {item.cost}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground">
                            <Target className="w-3 h-3 inline mr-1" />
                            {item.knownTargets}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 5: Ocean Biomes and Depths (card-list) */}
      <section id="ocean-biomes-and-depths" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Waves className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">{t.modules.exquisiteFishingOceanBiomes.eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.exquisiteFishingOceanBiomes.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.exquisiteFishingOceanBiomes.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
              {t.modules.exquisiteFishingOceanBiomes.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {t.modules.exquisiteFishingOceanBiomes.biomes.map(
              (biome: any, index: number) => (
                <div
                  key={index}
                  className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[hsl(var(--nav-theme))] text-white text-sm font-bold">
                      {biome.progressionOrder}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                      <Waves className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      {biome.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <Ship className="w-3 h-3" /> {biome.requiredBoat}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <Coins className="w-3 h-3" /> {biome.entryCost}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <Gauge className="w-3 h-3" /> {biome.depthRange}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Fish className="w-3 h-3" /> {t.modules.exquisiteFishingOceanBiomes.fieldLabels.notableCatches}
                    </p>
                    <ul className="space-y-1">
                      {biome.notableCatches.map((c: any, ci: number) => (
                        <li key={ci} className="text-sm flex items-center justify-between gap-2">
                          <span className="text-muted-foreground">{c.name} · {c.depth}</span>
                          <span className="text-[hsl(var(--nav-theme-light))] font-medium flex items-center gap-1">
                            <Gem className="w-3 h-3" /> {c.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Hammer className="w-3 h-3" /> {t.modules.exquisiteFishingOceanBiomes.fieldLabels.recommendedEquipment}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {biome.recommendedEquipment.map((eq: string, ei: number) => (
                        <span key={ei} className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground flex items-start gap-2 p-2 rounded bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <Target className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                    <span>{biome.importantUnlock}</span>
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Baits and Catch Requirements (accordion) */}
      <section id="baits-and-catch-requirements" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Gift className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">{t.modules.exquisiteFishingBaitsAndCatches.eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.exquisiteFishingBaitsAndCatches.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.exquisiteFishingBaitsAndCatches.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
              {t.modules.exquisiteFishingBaitsAndCatches.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-2 md:space-y-3">
            {t.modules.exquisiteFishingBaitsAndCatches.creatures.map(
              (creature: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() =>
                      setBaitsExpanded(baitsExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold flex items-center gap-2">
                      <Fish className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      {creature.creature}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground font-normal">
                        {creature.appearances.length} appearances
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${baitsExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {baitsExpanded === index && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5">
                      <div className="space-y-2">
                        {creature.appearances.map((ap: any, ai: number) => (
                          <div
                            key={ai}
                            className="p-3 rounded-lg bg-white/5 border border-border grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs"
                          >
                            <span className="flex items-center gap-1">
                              <MapIcon className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                              <span className="text-muted-foreground">{ap.biome}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Gauge className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                              <span className="text-muted-foreground">{ap.depth}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Gem className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                              <span className="text-[hsl(var(--nav-theme-light))] font-medium">{ap.value}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Anchor className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                              <span className="text-muted-foreground">{ap.hook}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Gift className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                              <span className="text-muted-foreground">{ap.baitOrGift}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 5: 第六模块之后 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 7: Money and Shop Guide (steps) */}
      <section id="money-and-shop-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Coins className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">{t.modules.exquisiteFishingMoneyAndShop.eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.exquisiteFishingMoneyAndShop.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.exquisiteFishingMoneyAndShop.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
              {t.modules.exquisiteFishingMoneyAndShop.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.exquisiteFishingMoneyAndShop.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                      <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {step.step}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg md:text-xl font-bold mb-1.5">{step.title}</h3>
                      <p className="text-sm text-[hsl(var(--nav-theme-light))] flex items-start gap-2 mb-2">
                        <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{step.goal}</span>
                      </p>

                      {step.purchases && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {step.purchases.map((p: string, pi: number) => (
                            <span key={pi} className="text-xs px-2 py-0.5 rounded bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center gap-1">
                              <Gift className="w-3 h-3" /> {p}
                            </span>
                          ))}
                        </div>
                      )}

                      {step.entryCost && (
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <Coins className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                          Entry cost: <span className="text-[hsl(var(--nav-theme-light))] font-medium">{step.entryCost}</span>
                        </p>
                      )}

                      {step.target && (
                        <div className="inline-flex items-center gap-2 mb-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-border">
                          <Fish className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                          <span className="font-medium">{step.target.creature}</span>
                          <span className="text-muted-foreground">{step.target.depth}</span>
                          <span className="text-[hsl(var(--nav-theme-light))] font-medium flex items-center gap-1">
                            <Gem className="w-3 h-3" /> {step.target.value}
                          </span>
                        </div>
                      )}

                      {step.bestTarget && (
                        <div className="inline-flex items-center gap-2 mb-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-border">
                          <Fish className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                          <span className="font-medium">{step.bestTarget.creature}</span>
                          <span className="text-muted-foreground">{step.bestTarget.depth}</span>
                          <span className="text-[hsl(var(--nav-theme-light))] font-medium flex items-center gap-1">
                            <Gem className="w-3 h-3" /> {step.bestTarget.value}
                          </span>
                        </div>
                      )}

                      {step.targets && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                          {step.targets.map((tgt: any, ti: number) => (
                            <div key={ti} className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-border flex items-center gap-2">
                              <Fish className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                              <span className="font-medium">{tgt.creature}</span>
                              <span className="text-muted-foreground">{tgt.depth}</span>
                              <span className="text-[hsl(var(--nav-theme-light))] font-medium ml-auto flex items-center gap-1">
                                <Gem className="w-3 h-3" /> {tgt.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {step.secondaryGoal && (
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <Route className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                          {step.secondaryGoal.item} · {step.secondaryGoal.depth}
                        </p>
                      )}

                      <p className="text-sm text-muted-foreground flex items-start gap-2">
                        <Route className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                        <span>{step.strategy}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 8: All Scenes and Gallery Unlocks (accordion) */}
      <section id="all-scenes-and-gallery-unlocks" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Images className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">{t.modules.exquisiteFishingAllScenes.eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.exquisiteFishingAllScenes.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.exquisiteFishingAllScenes.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
              {t.modules.exquisiteFishingAllScenes.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-2 md:space-y-3">
            {t.modules.exquisiteFishingAllScenes.biomes.map(
              (biome: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() =>
                      setScenesExpanded(scenesExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold flex items-center gap-2">
                      <Waves className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      {biome.biome}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground font-normal">
                        {biome.unlocks.length} unlocks
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${scenesExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {scenesExpanded === index && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5">
                      <div className="flex flex-wrap gap-2 mb-3 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                          <Ship className="w-3 h-3" /> {biome.requiredBoat}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                          <Coins className="w-3 h-3" /> {biome.entryCost}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {biome.unlocks.map((u: any, ui: number) => (
                          <div
                            key={ui}
                            className="p-3 rounded-lg bg-white/5 border border-border flex items-start gap-2"
                          >
                            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium flex items-center gap-2 flex-wrap">
                                <Fish className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                                {u.target}
                                <span className="text-xs text-muted-foreground">{u.depth}</span>
                                <span className="text-xs text-[hsl(var(--nav-theme-light))] font-medium flex items-center gap-1">
                                  <Gem className="w-3 h-3" /> {u.value}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                                <span className="flex items-center gap-1"><Anchor className="w-3 h-3" /> {u.hook}</span>
                                <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> {u.gift}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://x.com/PinkySoulOG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/2146300/Exquisite_Fishing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steam}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/sharedfiles/filedetails/?id=3097137644"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamGuide}
                  </a>
                </li>
                <li>
                  <a
                    href="https://phracassado.itch.io/exquisite-fishing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.itchio}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
