'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, CheckCircle, CreditCard, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { t, dir } = useI18n();
  const [done, setDone] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const [error, setError] = useState('');
  const shipping = subtotal >= 500 ? 0 : 35;
  const ArrowIcon = dir === 'rtl' ? ArrowRight : ArrowRight;

  if (done) {
    return (
      <div className="bg-mesh min-h-screen page-enter">
        <div className="container mx-auto px-4 py-20 text-center max-w-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-5">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-3">{t('checkout.success')}</h1>
          <p className="text-muted-foreground mb-2">{t('checkout.orderNumber')}</p>
          <p className="text-2xl font-bold text-primary mb-6">{orderNo}</p>
          <p className="text-sm text-muted-foreground mb-8">{t('checkout.willCall')}</p>
          <Button asChild><Link href="/">{t('checkout.backShopping')}</Link></Button>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold mb-5">{t('cart.empty')}</h1>
        <Button asChild><Link href="/search">{t('cart.startShopping')}</Link></Button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const number = `YM-${Date.now().toString().slice(-6)}`;
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      order_number: number,
      full_name: String(form.get('fullName')),
      phone: String(form.get('phone')),
      city: String(form.get('city')),
      address: String(form.get('address')),
      notes: String(form.get('notes') || ''),
      subtotal, shipping, total: subtotal + shipping,
    }).select('id').maybeSingle();

    if (orderError || !order) { setError('Error'); return; }

    const { error: itemsError } = await supabase.from('order_items').insert(items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      title: item.title,
      variant_title: item.variantTitle,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })));

    if (itemsError) { setError('Error'); return; }
    setOrderNo(number);
    clearCart();
    setDone(true);
  };

  return (
    <div className="bg-mesh min-h-screen page-enter">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/cart" className="hover:text-primary transition-colors">{t('cart.title')}</Link>
          <ArrowIcon className="h-4 w-4" />
          <span>{t('checkout.title')}</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-center md:text-right">{t('checkout.title')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={submit} className="lg:col-span-2 space-y-6">
            <div className="border rounded-2xl p-5 bg-card shadow-card">
              <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> {t('checkout.deliveryInfo')}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input required name="fullName" placeholder={t('checkout.fullName')} />
                <Input required name="phone" placeholder={t('checkout.phone')} type="tel" />
                <Input required name="city" placeholder={t('checkout.city')} />
                <Input required name="address" placeholder={t('checkout.address')} className="md:col-span-2" />
              </div>
              <Textarea name="notes" placeholder={t('checkout.notes')} className="mt-4" />
            </div>

            <div className="border rounded-2xl p-5 bg-card shadow-card">
              <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> {t('checkout.paymentMethod')}</h2>
              <div className="flex items-center gap-3 rounded-xl border-2 border-primary bg-accent/5 p-4">
                <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-primary/20 shrink-0" />
                <div><p className="font-bold">{t('checkout.cod')}</p><p className="text-sm text-muted-foreground">{t('checkout.codDesc')}</p></div>
              </div>
            </div>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" size="lg" className="w-full rounded-xl font-bold">{t('checkout.confirm')}</Button>
          </form>

          <div className="border rounded-2xl p-5 h-fit bg-card shadow-card">
            <h2 className="font-heading font-bold text-lg mb-4 text-center md:text-right">{t('checkout.orderSummary')}</h2>
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-3 mb-4 items-center">
                <img src={item.image} alt={item.title} className="h-14 w-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 text-sm"><p className="line-clamp-1 font-medium">{item.title}</p><p className="text-muted-foreground">{item.quantity} × {item.price} {t('common.currency')}</p></div>
              </div>
            ))}
            <div className="border-t pt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t('cart.subtotal')}</span><span>{subtotal} {t('common.currency')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t('cart.shipping')}</span><span>{shipping === 0 ? t('cart.free') : `${shipping} ${t('common.currency')}`}</span></div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>{t('cart.total')}</span><span className="text-primary">{subtotal + shipping} {t('common.currency')}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
