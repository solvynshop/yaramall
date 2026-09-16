import { notFound } from 'next/navigation';
import { getProductByHandle, getLocalProducts } from '@/lib/shopify';
import { ProductDetail } from '@/components/product-detail';

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle);
  if (!product) notFound();
  const related = getLocalProducts().filter((p) => p.categoryHandle === product.categoryHandle && p.id !== product.id).slice(0, 4);
  return <ProductDetail product={product} related={related} />;
}
