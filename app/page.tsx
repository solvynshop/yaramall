import { getProducts, getCollections, getLocalCategories } from '@/lib/shopify';
import { Homepage } from '@/components/homepage';

export default async function Home() {
  const products = await getProducts();
  const liveCategories = await getCollections();
  const categories = liveCategories.length ? liveCategories : getLocalCategories();

  return <Homepage products={products} categories={categories} />;
}
