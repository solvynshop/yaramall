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
  Globe,
} from 'lucide-react';

const localeNames: Record<Locale, string> = { ar: 'العربية', fr: 'Français', en: 'English' };
const localeFlags: Record<Locale, string> = { ar: '🇲🇦', fr: '🇫🇷', en: '🇬🇧' };

export function Header() {
  const { totalItems, setIsOpen } = useCart();
  const { locale, setLocale, t, dir } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const categories = getLocalCategories();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-500 ${scrolled ? 'glass shadow-card' : 'bg-background'}`}>
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
                    <span className="text-lg">{localeFlags[loc]}</span> {localeNames[loc]}
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
            <form action="/search" className="flex w-full">
              <Input type="search" name="q" placeholder={t('search.placeholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-l-none border-l-0 bg-muted/50 border-2 border-r-2 border-r-transparent focus-visible:border-r-primary/50 text-base" />
              <Button type="submit" className="rounded-r-none px-8 text-base font-medium"><Search className="h-5 w-5" /></Button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language switcher - desktop */}
            <div className="relative hidden md:block">
              <Button variant="ghost" size="sm" className="gap-1.5 px-3" onClick={() => setLangOpen(!langOpen)}>
                <Globe className="h-4 w-4" />
                <span className="text-xs font-bold">{locale.toUpperCase()}</span>
              </Button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute top-full mt-2 z-50 w-40 rounded-xl border bg-popover shadow-float p-1.5 animate-slide-down">
                    {(['ar', 'fr', 'en'] as Locale[]).map((loc) => (
                      <button key={loc} onClick={() => { setLocale(loc); setLangOpen(false); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent/10 transition-colors ${locale === loc ? 'text-primary font-bold bg-accent/5' : ''}`}>
                        <span className="text-base">{localeFlags[loc]}</span> {localeNames[loc]}
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
          <form action="/search" className="flex">
            <Input type="search" name="q" placeholder={t('search.placeholder')} className="rounded-l-none border-l-0 bg-muted/50" />
            <Button type="submit" className="rounded-r-none px-4"><Search className="h-5 w-5" /></Button>
          </form>
        </div>
      </div>

      {/* Category nav - desktop */}
      <nav className="hidden md:block border-t border-border/50">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-1 py-2.5">
            <li><Link href="/" className="block rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-accent/10 hover:text-primary transition-colors">{t('nav.home')}</Link></li>
            {categories.map((cat) => (
              <li key={cat.id}><Link href={`/collections/${cat.handle}`} className="block rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-accent/10 hover:text-primary transition-colors">{cat.title}</Link></li>
            ))}
            <li><Link href="/search" className="block rounded-lg px-4 py-1.5 text-sm font-bold text-primary hover:bg-accent/10 transition-colors">{t('nav.allProducts')}</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
