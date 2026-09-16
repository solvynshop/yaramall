import { notFound } from 'next/navigation';
import { getCollections, getProductsByCollection, getLocalCategories } from '@/lib/shopify';
import { getTranslation } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale-server';
import { ProductCard } from '@/components/product-card';
import { ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default async function CollectionPage({ params }: { params: { handle: string } }) {
  const locale = await getServerLocale();
  const t = (key: string) => getTranslation(locale, key);
  const categories = getLocalCategories(locale);
  const category = categories.find((c) => c.handle === params.handle);
  const liveCollections = await getCollections(locale);
  const liveCategory = liveCollections.find((c) => c.handle === params.handle);
  const currentCategory = category || liveCategory;
  if (!currentCategory) notFound();
  const products = await getProductsByCollection(params.handle);

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-14">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
          <ArrowRight className="h-3.5 w-3.5" />
          <span>{currentCategory.title}</span>
        </div>

        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-accent/5 px-6 py-10 md:px-12 md:py-14 mb-10 text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" /> {t('collection.curatedBadge')}
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">{currentCategory.title}</h1>
            <p className="text-muted-foreground leading-loose max-w-xl mx-auto">{currentCategory.description}</p>
          </div>
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <span className="text-sm text-muted-foreground">{products.length} {t('common.products')}</span>
          <button className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:border-primary transition-colors">
            <SlidersHorizontal className="h-4 w-4" /> {t('collection.filterSort')}
          </button>
        </div>

        {products.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="py-20 text-center text-muted-foreground">{t('collection.empty')}</p>
        )}
      </div>
    </div>
  );
}
