import { notFound } from 'next/navigation';
import { getCollections, getProductsByCollection, getLocalCategories } from '@/lib/shopify';
import { getTranslation } from '@/lib/translations';
import { getServerLocale } from '@/lib/locale-server';
import { ProductCard } from '@/components/product-card';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-14">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
          <ArrowRight className="h-3.5 w-3.5" />
          <span>{currentCategory.title}</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 tracking-tight">{currentCategory.title}</h1>
          {currentCategory.description && (
            <p className="text-muted-foreground max-w-xl">{currentCategory.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <span className="text-sm text-muted-foreground">{products.length} {t('common.products')}</span>
          <button className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:border-primary transition-colors">
            <SlidersHorizontal className="h-4 w-4" /> {t('collection.filterSort')}
          </button>
        </div>

        {products.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="py-20 text-center text-muted-foreground">{t('collection.empty')}</p>
        )}
      </div>
    </div>
  );
}