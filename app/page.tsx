import { getProducts, getCollections, getLocalCategories } from '@/lib/shopify';
import { Homepage } from '@/components/homepage';
import { getServerLocale } from '@/lib/locale-server';

export default async function Home() {
  const locale = await getServerLocale();
  const products = await getProducts();
  const liveCategories = await getCollections(locale);
  const categories = liveCategories.length ? liveCategories : getLocalCategories(locale);

  return <Homepage products={products} categories={categories} />;
}
