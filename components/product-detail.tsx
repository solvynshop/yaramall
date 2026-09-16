'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useI18n } from '@/lib/i18n';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw, Check, ChevronRight, Heart, Share2, CircleCheck, PackageCheck } from 'lucide-react';

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { addItem } = useCart();
  const { t, dir } = useI18n();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'reviews'>('details');
  const discount = product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;
  const add = () => { addItem(product, selectedVariant, quantity); setAdded(true); setTimeout(() => setAdded(false), 2200); };
  const ChevronIcon = dir === 'rtl' ? ChevronRight : ChevronRight;

  return (
    <div className="bg-mesh page-enter">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
          <ChevronIcon className="h-3.5 w-3.5" />
          <Link href={`/collections/${product.categoryHandle}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronIcon className="h-3.5 w-3.5" />
          <span className="text-foreground truncate">{product.title}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="md:sticky md:top-32">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted/50 border border-border/60 shadow-card">
              {discount > 0 && <span className="absolute top-5 right-5 z-10 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">-{discount}%</span>}
              <img src={product.images[selectedImage]?.url} alt={product.title} className="h-full w-full object-cover animate-fade-in" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button onClick={() => setLiked(!liked)} className={`flex h-10 w-10 items-center justify-center rounded-full glass shadow-sm transition-colors ${liked ? 'text-primary' : 'text-foreground'}`}><Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} /></button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full glass shadow-sm"><Share2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="flex gap-3 mt-4 justify-center md:justify-start overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button key={img.id} onClick={() => setSelectedImage(i)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${selectedImage === i ? 'border-primary shadow-glow' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={img.url} alt={product.title} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="py-1 md:py-4">
            <div className="mb-4 flex items-center justify-center md:justify-start gap-2">
              <div className="flex">{[1,2,3,4,5].map((s) => <Star key={s} className={`h-4 w-4 ${s <= Math.round(product.rating) ? 'fill-primary text-primary' : 'text-muted'}`} />)}</div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} {t('product.reviews')})</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5 text-center md:text-right">{product.title}</h1>
            <p className="text-base leading-loose text-muted-foreground mb-7 max-w-xl mx-auto md:mx-0 text-center md:text-right">{product.description}</p>
            <div className="flex items-end justify-center md:justify-start gap-4 mb-7 flex-wrap">
              <span className="text-4xl font-bold text-primary">{selectedVariant.price} <span className="text-base font-normal">{t('common.currency')}</span></span>
              {selectedVariant.compareAtPrice && <span className="text-lg text-muted-foreground line-through mb-1">{selectedVariant.compareAtPrice} {t('common.currency')}</span>}
            </div>

            {product.variants.length > 1 && (
              <div className="mb-7">
                <div className="mb-3 flex items-center justify-between max-w-md mx-auto md:mx-0">
                  <label className="text-sm font-bold">{t('product.details')}</label>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {product.variants.map((v) => (
                    <button key={v.id} onClick={() => setSelectedVariant(v)} className={`rounded-xl border px-4 py-2.5 text-sm transition-all ${selectedVariant.id === v.id ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'hover:border-primary/50'}`}>{v.title}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mb-7 justify-center md:justify-start">
              <div className="flex items-center rounded-xl border bg-card">
                <button className="p-3.5 hover:text-primary transition-colors" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button className="p-3.5 hover:text-primary transition-colors" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></button>
              </div>
              <Button size="lg" className="h-14 flex-1 max-w-sm rounded-xl text-base font-bold shadow-glow" onClick={add}>
                {added ? <><Check className="ml-2 h-5 w-5" /> {t('product.added')}</> : <><ShoppingBag className="ml-2 h-5 w-5" /> {t('product.addToCart')}</>}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl border bg-card/60 p-4 mb-8 max-w-xl mx-auto md:mx-0">
              <div className="flex flex-col items-center text-center gap-2"><Truck className="h-5 w-5 text-primary" /><span className="text-[11px] font-medium">{t('trust.fastDelivery')}<br /><small className="text-muted-foreground">{t('trust.fastDeliveryDesc')}</small></span></div>
              <div className="flex flex-col items-center text-center gap-2 border-x"><ShieldCheck className="h-5 w-5 text-accent" /><span className="text-[11px] font-medium">{t('trust.quality')}<br /><small className="text-muted-foreground">{t('trust.qualityDesc')}</small></span></div>
              <div className="flex flex-col items-center text-center gap-2"><RotateCcw className="h-5 w-5 text-primary" /><span className="text-[11px] font-medium">7<br /><small className="text-muted-foreground">{t('product.shippingTab')}</small></span></div>
            </div>

            <div className="rounded-2xl bg-foreground p-5 text-background max-w-xl mx-auto md:mx-0">
              <div className="flex items-center gap-2 mb-2"><CircleCheck className="h-5 w-5 text-accent" /><span className="font-bold">{t('product.codAvailable')}</span></div>
              <p className="text-xs text-background/60 mr-7">{t('product.codDesc')}</p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 md:mt-24 pb-12">
            <div className="text-center mb-7">
              <p className="text-sm font-bold text-primary mb-1">{t('best.badge')}</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold">{t('product.related')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 z-30 border-t bg-background/95 p-3 backdrop-blur-lg md:hidden">
        <div className="flex items-center gap-3">
          <div><p className="text-xs text-muted-foreground">{t('product.total')}</p><p className="font-bold text-primary">{selectedVariant.price * quantity} {t('common.currency')}</p></div>
          <Button className="h-12 flex-1 rounded-xl font-bold" onClick={add}>{added ? t('product.added') : t('product.addToCart')}</Button>
        </div>
      </div>
    </div>
  );
}
