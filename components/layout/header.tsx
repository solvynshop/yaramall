'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { useI18n, type Locale } from '@/lib/i18n';
import { getLocalCategories } from '@/lib/shopify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Search,
  ShoppingBag,
  Menu,
  Truck,
  Phone,
  ChevronLeft,
  LayoutGrid,
  ChefHat,
  Sparkles,
  Baby,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Dumbbell,
  PawPrint,
} from 'lucide-react';

const categoryIcons: Record<string, typeof ChefHat> = {
  kitchen: ChefHat,
  beauty: Sparkles,
  kids: Baby,
  electronics: Smartphone,
  fashion: Shirt,
  'home-decor': HomeIcon,
  sports: Dumbbell,
  pets: PawPrint,
};

const localeNames: Record<Locale, string> = { ar: 'العربية', fr: 'Français', en: 'English' };

function FlagIcon({ locale, className = 'h-4 w-4' }: { locale: Locale; className?: string }) {
  if (locale === 'fr') {
    return (
      <svg viewBox="0 0 3 2" className={`${className} rounded-sm overflow-hidden shrink-0`}>
        <rect width="1" height="2" x="0" fill="#0055A4" />
        <rect width="1" height="2" x="1" fill="#FFFFFF" />
        <rect width="1" height="2" x="2" fill="#EF4135" />
      </svg>
    );
  }
  if (locale === 'en') {
    return (
      <svg viewBox="0 0 60 30" className={`${className} rounded-sm overflow-hidden shrink-0`}>
        <rect width="60" height="30" fill="#00247d" />
        <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 60,30 M60,0 0,30" stroke="#cf142b" strokeWidth="2" />
        <path d="M30,0 30,30 M0,15 60,15" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 30,30 M0,15 60,15" stroke="#cf142b" strokeWidth="6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 3 2" className={`${className} rounded-sm overflow-hidden shrink-0`}>
      <rect width="3" height="2" fill="#c1272d" />
      <path d="M1.5,0.7 1.65,1.15 2.1,1.15 1.75,1.4 1.9,1.85 1.5,1.6 1.1,1.85 1.25,1.4 0.9,1.15 1.35,1.15 Z" fill="#006233" />
    </svg>
  );
}

export function Header() {
  const { totalItems, setIsOpen } = useCart();
  const { locale, setLocale, t, dir } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const categories = getLocalCategories(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-500 [transition-timing-function:var(--ease-out-apple)] ${scrolled ? 'glass shadow-card' : 'bg-background'}`}>
      {/* Top bar */}
      <div className={`hidden md:block border-b border-border/50 transition-all duration-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="container mx-auto flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-primary" /> {t('trust.fastDelivery')} 24-48h</span>
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" /><span dir="ltr">+212 600 000 000</span></span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/track-order" className="hover:text-primary transition-colors">{t('nav.trackOrder')}</Link>
            <Link href="/about" className="hover:text-primary transition-colors">{t('nav.about')}</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">{t('nav.contact')}</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">{t('nav.faq')}</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 md:gap-8 py-4">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-[320px] sm:w-[380px] p-0">
              <SheetHeader className="px-6 py-5 border-b">
                <SheetTitle className={`flex items-center gap-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-bold text-lg">Y</div>
                  <span className="font-heading text-xl font-bold">Yara<span className="text-primary">Mall</span></span>
                </SheetTitle>
              </SheetHeader>
              <nav className="px-4 py-4 flex flex-col gap-1">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium hover:bg-accent/10 transition-colors">{t('nav.home')} <ChevronLeft className="h-4 w-4 text-muted-foreground" /></Link>
                <div className="px-4 py-2 text-xs font-bold uppercase text-muted-foreground">{t('footer.categories')}</div>
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/collections/${cat.handle}`} onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium hover:bg-accent/10 transition-colors">{cat.title} <ChevronLeft className="h-4 w-4 text-muted-foreground" /></Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <Link href="/search" onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-primary hover:bg-accent/10 transition-colors">{t('nav.allProducts')} <ChevronLeft className="h-4 w-4" /></Link>
                <Link href="/track-order" onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium hover:bg-accent/10 transition-colors">{t('nav.trackOrder')} <ChevronLeft className="h-4 w-4 text-muted-foreground" /></Link>
                <Link href="/about" onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium hover:bg-accent/10 transition-colors">{t('nav.about')} <ChevronLeft className="h-4 w-4 text-muted-foreground" /></Link>
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium hover:bg-accent/10 transition-colors">{t('nav.contact')} <ChevronLeft className="h-4 w-4 text-muted-foreground" /></Link>
                <Link href="/faq" onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium hover:bg-accent/10 transition-colors">{t('nav.faq')} <ChevronLeft className="h-4 w-4 text-muted-foreground" /></Link>
                {/* Language switcher in mobile */}
                <div className="my-2 h-px bg-border" />
                <div className="px-4 py-2 text-xs font-bold uppercase text-muted-foreground">Language / اللغة</div>
                {(['ar', 'fr', 'en'] as Locale[]).map((loc) => (
                  <button key={loc} onClick={() => { setLocale(loc); setMobileOpen(false); }} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-accent/10 transition-colors ${locale === loc ? 'text-primary font-bold' : ''}`}>
                    <FlagIcon locale={loc} className="h-4 w-4" /> {localeNames[loc]}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-heading font-bold text-xl shadow-glow transition-transform group-hover:scale-105">Y</div>
            <span className="font-heading text-2xl font-bold tracking-tight">Yara<span className="text-primary">Mall</span></span>
          </Link>

          {/* Search - desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <form action="/search" className="flex w-full items-center gap-2 rounded-full border-2 border-transparent bg-muted/50 pl-5 pr-1.5 py-1 transition-colors focus-within:border-primary/40 focus-within:bg-background">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input type="search" name="q" placeholder={t('search.placeholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-8 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" />
              <Button type="submit" size="icon" className="h-9 w-9 shrink-0"><Search className="h-4 w-4" /></Button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language switcher - desktop */}
            <div className="relative hidden md:block">
              <Button variant="ghost" size="sm" className="gap-1.5 px-3" onClick={() => setLangOpen(!langOpen)}>
                <FlagIcon locale={locale} className="h-4 w-4" />
                <span className="text-xs font-bold">{locale.toUpperCase()}</span>
              </Button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute top-full mt-2 z-50 w-40 rounded-xl border bg-popover shadow-float p-1.5 animate-slide-down">
                    {(['ar', 'fr', 'en'] as Locale[]).map((loc) => (
                      <button key={loc} onClick={() => { setLocale(loc); setLangOpen(false); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent/10 transition-colors ${locale === loc ? 'text-primary font-bold bg-accent/5' : ''}`}>
                        <FlagIcon locale={loc} className="h-4 w-4" /> {localeNames[loc]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground animate-scale-in">{totalItems}</span>}
            </Button>
          </div>
        </div>

        {/* Search - mobile */}
        <div className="md:hidden pb-3">
          <form action="/search" className="flex items-center gap-2 rounded-full border-2 border-transparent bg-muted/50 pl-4 pr-1.5 py-1 transition-colors focus-within:border-primary/40 focus-within:bg-background">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input type="search" name="q" placeholder={t('search.placeholder')} className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0"><Search className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>

      {/* Category nav - desktop */}
      <nav className="hidden md:block border-t border-border/50">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1.5 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <li className="shrink-0">
              <Link href="/" className="pressable flex flex-col items-center gap-1 rounded-2xl px-3.5 py-1.5 transition-colors hover:bg-accent/10 hover:text-primary">
                <LayoutGrid className="h-5 w-5" />
                <span className="whitespace-nowrap text-[11px] font-medium leading-none">{t('nav.home')}</span>
              </Link>
            </li>
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.handle] || LayoutGrid;
              return (
                <li key={cat.id} className="shrink-0">
                  <Link href={`/collections/${cat.handle}`} className="pressable flex flex-col items-center gap-1 rounded-2xl px-3.5 py-1.5 transition-colors hover:bg-accent/10 hover:text-primary">
                    <Icon className="h-5 w-5" />
                    <span className="whitespace-nowrap text-[11px] font-medium leading-none">{cat.title}</span>
                  </Link>
                </li>
              );
            })}
            <li className="shrink-0">
              <Link href="/search" className="pressable flex flex-col items-center gap-1 rounded-2xl px-3.5 py-1.5 text-primary transition-colors hover:bg-accent/10">
                <Search className="h-5 w-5" />
                <span className="whitespace-nowrap text-[11px] font-bold leading-none">{t('nav.allProducts')}</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
