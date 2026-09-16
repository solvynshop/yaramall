'use client';

import Link from 'next/link';
import { getLocalCategories } from '@/lib/shopify';
import { useI18n } from '@/lib/i18n';
import { Facebook, MessageCircle, Mail, Phone, MapPin, Truck, ShieldCheck, CreditCard, Headphones, ArrowLeft } from 'lucide-react';

export function Footer() {
  const { t, dir } = useI18n();
  const categories = getLocalCategories();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowLeft;

  return (
    <footer className="bg-foreground text-background">
      <div className="border-b border-background/10">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4 py-12">
          {[
            { icon: Truck, title: t('trust.fastDelivery'), desc: t('trust.fastDeliveryDesc') },
            { icon: CreditCard, title: t('trust.cod'), desc: t('trust.codDesc') },
            { icon: ShieldCheck, title: t('trust.quality'), desc: t('trust.qualityDesc') },
            { icon: Headphones, title: t('trust.support'), desc: t('trust.supportDesc') },
          ].map((s) => (
            <div key={s.title} className="flex items-center gap-3.5 group justify-center md:justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shrink-0 transition-transform group-hover:scale-110">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="text-center md:text-right">
                <h4 className="font-heading font-bold text-sm">{s.title}</h4>
                <p className="text-xs text-background/50 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1 text-center md:text-right">
            <Link href="/" className="flex items-center gap-2.5 mb-5 justify-center md:justify-start">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-heading font-bold text-xl">Y</div>
              <span className="font-heading text-2xl font-bold">Yara<span className="text-primary">Mall</span></span>
            </Link>
            <p className="text-sm text-background/50 leading-relaxed mb-5">{t('footer.tagline')}</p>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 hover:bg-primary transition-all hover:scale-110" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 hover:bg-primary transition-all hover:scale-110" aria-label="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 hover:bg-primary transition-all hover:scale-110" aria-label="Email"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="text-center md:text-right">
            <h4 className="font-heading font-bold text-base mb-5">{t('footer.categories')}</h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/collections/${cat.handle}`} className="text-sm text-background/50 hover:text-primary transition-colors flex items-center gap-1 group justify-center md:justify-start">
                    {cat.title}
                    <ArrowIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="font-heading font-bold text-base mb-5">{t('footer.links')}</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-background/50 hover:text-primary transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/contact" className="text-sm text-background/50 hover:text-primary transition-colors">{t('nav.contact')}</Link></li>
              <li><Link href="/track-order" className="text-sm text-background/50 hover:text-primary transition-colors">{t('nav.trackOrder')}</Link></li>
              <li><Link href="/faq" className="text-sm text-background/50 hover:text-primary transition-colors">{t('nav.faq')}</Link></li>
              <li><Link href="/policies" className="text-sm text-background/50 hover:text-primary transition-colors">{t('nav.policies')}</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="font-heading font-bold text-base mb-5">{t('footer.contact')}</h4>
            <ul className="space-y-3.5 inline-block text-right">
              <li className="flex items-center gap-2.5 text-sm text-background/50"><Phone className="h-4 w-4 text-primary shrink-0" /><span dir="ltr">+212 600 000 000</span></li>
              <li className="flex items-center gap-2.5 text-sm text-background/50"><Mail className="h-4 w-4 text-primary shrink-0" />contact@yaramall.ma</li>
              <li className="flex items-start gap-2.5 text-sm text-background/50"><MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />Casablanca, Maroc</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-5 text-center text-sm text-background/40">© {new Date().getFullYear()} YaraMall. {t('footer.rights')}</div>
      </div>
    </footer>
  );
}
