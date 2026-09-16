'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const { t, dir } = useI18n();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-left rtl:text-right">
            <ShoppingBag className="h-5 w-5 text-primary" />
            {t('cart.title')} ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">{t('cart.empty')}</p>
            <p className="text-sm text-muted-foreground text-center">{t('cart.emptyDesc')}</p>
            <Button onClick={() => setIsOpen(false)} asChild>
              <Link href="/search">{t('cart.startShopping')}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3 pb-4 border-b last:border-0">
                  <Link href={`/products/${item.handle}`} onClick={() => setIsOpen(false)} className="shrink-0">
                    <img src={item.image} alt={item.title} className="h-20 w-20 rounded-lg object-cover bg-muted" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.handle}`} onClick={() => setIsOpen(false)} className="block">
                      <h4 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">{item.title}</h4>
                    </Link>
                    {item.variantTitle !== 'افتراضي' && item.variantTitle !== 'Default' && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.variantTitle}</p>
                    )}
                    <p className="text-sm font-bold text-primary mt-1">{item.price} {t('common.currency')}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.variantId, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.variantId)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-5 py-4 space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('cart.subtotal')}</span>
                <span className="text-lg font-bold">{subtotal} {t('common.currency')}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t('cart.codAvailable')}</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/cart" onClick={() => setIsOpen(false)}>{t('cart.viewCart')}</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>{t('cart.checkoutBtn')}</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
