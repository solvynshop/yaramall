'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const { t, dir } = useI18n();
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 35;
  const ArrowIcon = dir === 'rtl' ? ArrowRight : ArrowRight;

  return (
    <div className="bg-mesh min-h-screen page-enter">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
          <ArrowIcon className="h-4 w-4" />
          <span>{t('cart.title')}</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-center md:text-left rtl:md:text-right">{t('cart.title')}</h1>

        {!items.length ? (
          <div className="py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-5">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground mb-2">{t('cart.empty')}</p>
            <p className="text-sm text-muted-foreground mb-6">{t('cart.emptyDesc')}</p>
            <Button asChild><Link href="/search">{t('cart.startShopping')}</Link></Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 p-4 border rounded-2xl bg-card shadow-card">
                  <Link href={`/products/${item.handle}`} className="shrink-0">
                    <img src={item.image} alt={item.title} className="h-24 w-24 object-cover rounded-xl" />
                  </Link>
                  <div className="flex-1 text-center md:text-left rtl:md:text-right">
                    <Link href={`/products/${item.handle}`} className="font-bold hover:text-primary transition-colors">{item.title}</Link>
                    {item.variantTitle !== 'افتراضي' && item.variantTitle !== 'Default' && <p className="text-sm text-muted-foreground mt-1">{item.variantTitle}</p>}
                    <p className="font-bold text-primary mt-2">{item.price} {t('common.currency')}</p>
                  </div>
                  <div className="flex flex-col items-center justify-between gap-3">
                    <button onClick={() => removeItem(item.variantId)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    <div className="flex items-center border rounded-lg">
                      <button className="p-2 hover:text-primary transition-colors" onClick={() => updateQuantity(item.variantId, item.quantity - 1)} disabled={item.quantity <= 1}><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button className="p-2 hover:text-primary transition-colors" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border rounded-2xl p-5 h-fit bg-card shadow-card">
              <h2 className="font-heading font-bold text-lg mb-4 text-center md:text-left rtl:md:text-right">{t('checkout.orderSummary')}</h2>
              <div className="flex justify-between text-sm mb-3"><span className="text-muted-foreground">{t('cart.subtotal')}</span><span>{subtotal} {t('common.currency')}</span></div>
              <div className="flex justify-between text-sm mb-4"><span className="text-muted-foreground">{t('cart.shipping')}</span><span>{shipping === 0 ? t('cart.free') : `${shipping} ${t('common.currency')}`}</span></div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg mb-5"><span>{t('cart.total')}</span><span className="text-primary">{subtotal + shipping} {t('common.currency')}</span></div>
              <Button className="w-full" size="lg" asChild><Link href="/checkout">{t('cart.checkout')}</Link></Button>
              <p className="text-xs text-muted-foreground text-center mt-3">{t('cart.codAvailable')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
