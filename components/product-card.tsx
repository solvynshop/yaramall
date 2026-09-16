'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useI18n } from '@/lib/i18n';
import { Star, ShoppingBag, Check, ArrowUpLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { t, dir } = useI18n();
  const [added, setAdded] = useState(false);
  const discount = product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;
  const handleAdd = () => { addItem(product, product.variants[0], 1); setAdded(true); setTimeout(() => setAdded(false), 1800); };
  const ArrowIcon = dir === 'rtl' ? ArrowUpLeft : ArrowUpLeft;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-float hover:border-primary/20">
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
        {discount > 0 && <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-sm">-{discount}%</span>}
        {product.isBestSeller && <span className="rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold text-background shadow-sm">{t('common.bestSeller')}</span>}
      </div>

      <Link href={`/products/${product.handle}`} className="relative aspect-square overflow-hidden bg-muted/40 block">
        <img src={product.images[0]?.url || ''} alt={product.title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        {product.images[1] && <img src={product.images[1].url} alt={product.title} className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-foreground/85 py-2.5 text-xs font-medium text-background backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
          {t('product.viewDetails')} <ArrowIcon className="mr-1.5 h-3.5 w-3.5" />
        </div>
        {!product.available && <div className="absolute inset-0 flex items-center justify-center bg-background/70"><span className="rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background">{t('common.outOfStock')}</span></div>}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-center gap-1.5">
          <div className="flex">{[1,2,3,4,5].map((star) => <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.round(product.rating) ? 'fill-primary text-primary' : 'fill-muted text-muted'}`} />)}</div>
          <span className="text-[11px] text-muted-foreground">({product.reviewCount})</span>
        </div>
        <Link href={`/products/${product.handle}`} className="block text-center">
          <h3 className="mb-3 line-clamp-2 min-h-[2.6rem] text-sm font-bold leading-relaxed hover:text-primary transition-colors">{product.title}</h3>
        </Link>
        <div className="mt-auto flex items-end justify-center gap-2">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-primary">{product.price} <span className="text-[11px] font-normal">{t('common.currency')}</span></span>
            {product.compareAtPrice && <span className="text-xs text-muted-foreground line-through">{product.compareAtPrice} {t('common.currency')}</span>}
          </div>
          <Button size="icon" className="h-10 w-10 shrink-0 rounded-xl shadow-sm transition-all hover:scale-105" onClick={handleAdd} disabled={!product.available}>
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </article>
  );
}
