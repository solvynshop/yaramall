import { getProducts, getLocalProducts } from '@/lib/shopify';
import { getTranslation } from '@/lib/translations';
import { getServerLocale } from '@/lib/locale-server';
import { ProductCard } from '@/components/product-card';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const locale = await getServerLocale();
  const t = (key: string) => getTranslation(locale, key);
  const all = await getProducts();
  const q = searchParams.q?.toLowerCase() || '';
  const products = q ? all.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) : all;

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-14">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2 text-center md:text-left rtl:md:text-right">{q ? `${t('search.resultsFor')}: ${q}` : t('search.allProducts')}</h1>
        <p className="text-muted-foreground mb-8 text-center md:text-left rtl:md:text-right">{products.length} {t('common.products')}</p>
        {products.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground">{t('search.noResults')}</div>
        )}
      </div>
    </div>
  );
}
