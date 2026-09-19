'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useRevealAll } from '@/hooks/use-reveal';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import type { Product, Category } from '@/lib/types';
import { ArrowLeft, ArrowRight, Check, Clock3, CreditCard, Headphones, Package, ShieldCheck, Sparkles, Star, Truck, Zap } from 'lucide-react';

export function Homepage({ products, categories }: { products: Product[]; categories: Category[] }) {
  const { t, dir } = useI18n();
  const containerRef = useRevealAll<HTMLDivElement>();
  const featured = products.filter((p) => p.isFeatured).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 6);
  const onSale = products.filter((p) => p.isOnSale).slice(0, 4);

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="overflow-hidden" ref={containerRef}>
      {/* Hero */}
      <section className="relative bg-mesh">
        <div className="container mx-auto px-4 py-10 md:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative z-10 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left rtl:lg:text-right animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold text-primary mb-6">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span>
                {t('hero.badge')}
              </div>
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black leading-[1.12] mb-6">{t('hero.title1')}<br /><span className="text-gradient">{t('hero.title2')}</span></h1>
              <p className="text-base md:text-lg leading-loose text-muted-foreground max-w-lg mx-auto lg:mr-0 lg:ml-auto mb-8">{t('hero.desc')}</p>
              <div className="flex flex-wrap justify-center lg:justify-start rtl:lg:justify-end gap-3">
                <Button size="lg" className="h-14 rounded-2xl px-8 text-base font-bold shadow-glow" asChild><Link href="/search">{t('hero.cta1')} <ArrowIcon className="ms-2 h-5 w-5" /></Link></Button>
                <Button size="lg" variant="outline" className="h-14 rounded-2xl px-8 text-base font-bold" asChild><Link href="/collections/kitchen">{t('hero.cta2')}</Link></Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start rtl:lg:justify-end gap-6 mt-10">
                <div className="flex -space-x-3 space-x-reverse">
                  {['https://i.pravatar.cc/80?img=1','https://i.pravatar.cc/80?img=5','https://i.pravatar.cc/80?img=9','https://i.pravatar.cc/80?img=12'].map((src) => (
                    <img key={src} src={src} alt="" className="h-9 w-9 rounded-full border-2 border-background object-cover" />
                  ))}
                </div>
                <div className="text-left rtl:text-right">
                  <div className="flex items-center gap-1 text-primary justify-center lg:justify-start rtl:lg:justify-end">{[1,2,3,4,5].map((s) => <Star key={s} className="h-3.5 w-3.5 fill-current" />)}</div>
                  <p className="text-xs text-muted-foreground mt-1">{t('hero.happyClients')}</p>
                </div>
              </div>
            </div>
            <div className="relative perspective animate-scale-in">
              <div className="absolute -top-10 -right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
              <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-float" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-primary/10 via-white to-accent/10 p-4 shadow-float rotate-1 hover:rotate-0 transition-transform duration-700">
                <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="YaraMall" className="aspect-[4/4.5] w-full rounded-[2rem] object-cover" />
                <div className="absolute bottom-8 right-8 left-8 glass rounded-2xl p-4 shadow-float">
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs text-muted-foreground">{t('hero.weeklyPicks')}</p><p className="font-heading font-bold mt-1">{t('hero.weeklyPicksDesc')}</p></div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Zap className="h-5 w-5 fill-current" /></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-5 rounded-2xl bg-foreground px-4 py-3 text-background shadow-float animate-float">
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /><span className="text-xs font-bold">{t('hero.securePayment')}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </section>

      {/* Trust bar */}
      <section className="border-b bg-card" data-reveal>
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-border/60 px-4">
          {[
            { icon: Truck, title: t('trust.fastDelivery'), desc: t('trust.fastDeliveryDesc') },
            { icon: CreditCard, title: t('trust.cod'), desc: t('trust.codDesc') },
            { icon: ShieldCheck, title: t('trust.quality'), desc: t('trust.qualityDesc') },
            { icon: Headphones, title: t('trust.support'), desc: t('trust.supportDesc') },
          ].map((s) => (
            <div key={s.title} className="flex items-center justify-center gap-3 py-5 px-2">
              <s.icon className="h-5 w-5 text-primary shrink-0" />
              <div><p className="text-xs md:text-sm font-bold">{s.title}</p><p className="hidden sm:block text-[11px] text-muted-foreground mt-0.5">{s.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-9" data-reveal>
            <div className="text-left rtl:text-right">
              <p className="text-sm font-bold text-primary mb-2">{t('cats.subtitle')}</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold">{t('cats.title')}</h2>
            </div>
            <Link href="/search" className="flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all shrink-0">{t('cats.viewAll')} <ArrowIcon className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-reveal data-reveal-delay="100">
            {categories.map((cat, index) => (
              <Link key={cat.id} href={`/collections/${cat.handle}`} className="group relative overflow-hidden rounded-2xl border bg-muted/30 shadow-card hover:shadow-float transition-all duration-500 hover:-translate-y-1 aspect-[4/5]">
                <img src={cat.image} alt={cat.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-4 text-center text-background">
                  <h3 className="font-heading text-base font-bold">{cat.title}</h3>
                  <p className="mt-1 text-[11px] text-background/70">{cat.productCount} {t('common.products')}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">{t('cats.shopNow')} <ArrowIcon className="h-3 w-3" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

            {/* Deals */}
      <section className="py-16 md:py-24" data-reveal>
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-9">
            <div className="text-left rtl:text-right">
              <p className="text-sm font-medium text-primary mb-2">{t('deals.badge')}</p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t('deals.title')}</h2>
            </div>
            <Link href="/search" className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all shrink-0">{t('best.viewAll')} <ArrowIcon className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">{onSale.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      </section>

      {/* Editorial banner */}
      <section className="py-16 md:py-24" data-reveal>
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/10 via-accent/5 to-muted p-8 md:p-14">
            <div className="grid md:grid-cols-2 items-center gap-8">
              <div className="max-w-lg mx-auto md:mx-0 text-center md:text-left rtl:md:text-right">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-4"><Sparkles className="h-4 w-4" /> {t('editorial.badge')}</span>
                <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4">{t('editorial.title1')}<br /><span className="text-gradient">{t('editorial.title2')}</span></h2>
                <p className="text-muted-foreground leading-loose mb-6">{t('editorial.desc')}</p>
                <Button variant="outline" className="rounded-xl font-bold" asChild><Link href="/search">{t('editorial.cta')} <ArrowIcon className="ms-2 h-4 w-4" /></Link></Button>
              </div>
              <div className="relative hidden md:block">
                <div className="absolute -top-8 -right-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
                <img src="https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=900" alt="" className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-float rotate-2 hover:rotate-0 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-mesh py-16 md:py-24" data-reveal>
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-9">
            <div className="text-left rtl:text-right">
              <p className="text-sm font-bold text-primary mb-2">{t('best.badge')}</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold">{t('best.title')}</h2>
            </div>
            <Link href="/search" className="flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all shrink-0">{t('best.viewAll')} <ArrowIcon className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">{bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24" data-reveal>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-primary mb-2">{t('test.badge')}</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">{t('test.title')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { name: 'سارة العلوي', city: 'الدار البيضاء', text: 'تجربة رائعة من البداية للنهاية. المنتج أجمل من الصور والتوصيل كان سريع جداً. بالتأكيد سأطلب مرة أخرى!', img: 'https://i.pravatar.cc/100?img=47' },
              { name: 'محمد بنعمر', city: 'الرباط', text: 'أحببت فكرة الدفع عند الاستلام، والخدمة كانت احترافية. الجودة ممتازة والسعر مناسب جداً.', img: 'https://i.pravatar.cc/100?img=11' },
              { name: 'نادية أمين', city: 'مراكش', text: 'المتجر سهل الاستخدام والمنتجات متنوعة. فريق الدعم تجاوب معي بسرعة وساعدني في اختيار المقاس.', img: 'https://i.pravatar.cc/100?img=32' },
            ].map((review) => (
              <div key={review.name} className="rounded-2xl border bg-card p-6 shadow-card hover:shadow-float transition-shadow">
                <div className="flex text-primary mb-4 justify-center">{[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}</div>
                <p className="text-sm leading-loose text-muted-foreground mb-5 text-center">“{review.text}”</p>
                <div className="flex items-center justify-center gap-3">
                  <img src={review.img} alt={review.name} className="h-10 w-10 rounded-full object-cover" />
                  <div className="text-center"><p className="text-sm font-bold">{review.name}</p><p className="text-xs text-muted-foreground">{review.city}</p></div>
                  <ShieldCheck className="h-4 w-4 text-accent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-24" data-reveal>
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-foreground p-8 md:p-14 text-center text-background">
            <div className="absolute top-0 right-1/3 h-48 w-48 rounded-full bg-primary/20 blur-3xl animate-float" />
            <div className="relative max-w-2xl mx-auto">
              <Package className="mx-auto h-10 w-10 text-primary mb-5" />
              <h2 className="font-heading text-2xl md:text-4xl font-bold mb-3">{t('cta.title')}</h2>
              <p className="text-background/50 mb-7">{t('cta.desc')}</p>
              <Button size="lg" className="rounded-xl px-8 font-bold" asChild><Link href="/search">{t('cta.btn')} <ArrowIcon className="ms-2 h-4 w-4" /></Link></Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
