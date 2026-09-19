'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useI18n } from '@/lib/i18n';
import { Star, Plus, Check } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { t } = useI18n();
  const [added, setAdded] = useState(false);
  const discount = product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;
  const handleAdd = () => { addItem(product, product.variants[0], 1); setAdded(true); setTimeout(() => setAdded(false), 1800); };

  return (
    <article className="group relative flex flex-col">
      <Link href={`/products/${product.handle}`} className="relative block aspect-square overflow-hidden rounded-3xl bg-muted/40">
        <img
          src={product.images[0]?.url || ''}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {discount > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-background/95 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur-sm">
            -{discount}%
          </span>
        )}

        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[2px]">
            <span className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background">
              {t('common.outOfStock')}
            </span>
          </div>
        )}

        <button
          onClick={(e) => { e.preventDefault(); handleAdd(); }}
          disabled={!product.available}
          aria-label={t('product.addToCart')}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-md opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 active:scale-95 disabled:pointer-events-none"
        >
          {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </Link>

      <div className="mt-3 flex flex-col gap-1">
        <Link href={`/products/${product.handle}`}>
          <h3 className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-xs text-muted-foreground">{product.rating.toFixed(1)} ({product.reviewCount})</span>
        </div>

        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-base font-semibold text-foreground">{product.price} {t('common.currency')}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through">{product.compareAtPrice} {t('common.currency')}</span>
          )}
        </div>
      </div>
    </article>
  );
}