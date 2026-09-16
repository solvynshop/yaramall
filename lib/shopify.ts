import type { Product, Category, ProductVariant, ProductImage } from './types';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '';
const SHOPIFY_API_VERSION = '2024-07';

const endpoint = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    throw new Error('Shopify credentials not configured');
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status}`);
  }

  const json: ShopifyGraphQLResponse<T> = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(', '));
  }
  return json.data as T;
}

function mapVariant(v: ShopifyRawVariant): ProductVariant {
  return {
    id: v.id,
    title: v.title,
    price: parseFloat(v.price.amount),
    compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null,
    available: v.availableForSale,
    sku: v.sku || undefined,
  };
}

function mapImage(img: ShopifyRawImage, idx: number): ProductImage {
  return {
    id: img.id || `img-${idx}`,
    url: img.url,
    altText: img.altText || undefined,
  };
}

function mapProduct(p: ShopifyRawProduct): Product {
  const variants = (p.variants?.edges || []).map((e) => mapVariant(e.node));
  const images = (p.images?.edges || []).map((e, i) => mapImage(e.node, i));
  const price = variants[0]?.price ?? 0;
  const compareAtPrice = variants[0]?.compareAtPrice ?? null;

  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    description: p.description || '',
    descriptionHtml: p.descriptionHtml || undefined,
    category: p.productType || 'General',
    categoryHandle: (p.productType || 'general').toLowerCase().replace(/\s+/g, '-'),
    price,
    compareAtPrice,
    currency: variants[0]?.price ? 'MAD' : 'MAD',
    images,
    variants,
    rating: 4.5,
    reviewCount: Math.floor(Math.random() * 200) + 10,
    tags: p.tags || [],
    isFeatured: p.tags?.includes('featured') || false,
    isBestSeller: p.tags?.includes('best-seller') || false,
    isOnSale: compareAtPrice !== null && compareAtPrice > price,
    available: variants.some((v) => v.available),
  };
}

const productFields = `
  id
  title
  handle
  description
  descriptionHtml
  productType
  tags
  images(first: 8) {
    edges {
      node {
        id
        url
        altText
      }
    }
  }
  variants(first: 20) {
    edges {
      node {
        id
        title
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        availableForSale
        sku
      }
    }
  }
`;

export async function getProducts(limit = 50): Promise<Product[]> {
  try {
    const data = await shopifyFetch<ShopifyProductsResponse>(`
      query GetProducts($limit: Int!) {
        products(first: $limit, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              ${productFields}
            }
          }
        }
      }
    `, { limit });

    return data.products.edges.map((e) => mapProduct(e.node));
  } catch {
    return getLocalProducts();
  }
}

export async function getProductsByCollection(handle: string): Promise<Product[]> {
  try {
    const data = await shopifyFetch<ShopifyCollectionResponse>(`
      query GetCollectionByHandle($handle: String!) {
        collectionByHandle(handle: $handle) {
          products(first: 50) {
            edges {
              node {
                ${productFields}
              }
            }
          }
        }
      }
    `, { handle });

    if (!data.collectionByHandle) return getLocalProducts().filter((p) => p.categoryHandle === handle);
    return data.collectionByHandle.products.edges.map((e) => mapProduct(e.node));
  } catch {
    return getLocalProducts().filter((p) => p.categoryHandle === handle);
  }
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  try {
    const data = await shopifyFetch<ShopifyProductResponse>(`
      query GetProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          ${productFields}
        }
      }
    `, { handle });

    if (!data.productByHandle) return null;
    return mapProduct(data.productByHandle);
  } catch {
    return getLocalProducts().find((p) => p.handle === handle) || null;
  }
}

export async function getCollections(locale: 'ar' | 'fr' | 'en' = 'ar'): Promise<Category[]> {
  try {
    const data = await shopifyFetch<ShopifyCollectionsResponse>(`
      query GetCollections {
        collections(first: 20) {
          edges {
            node {
              id
              title
              handle
              description
              image { url }
              productsCount
            }
          }
        }
      }
    `);

    return data.collections.edges.map((e) => ({
      id: e.node.id,
      title: e.node.title,
      handle: e.node.handle,
      description: e.node.description || '',
      image: e.node.image?.url || '',
      productCount: e.node.productsCount || 0,
    }));
  } catch {
    return getLocalCategories(locale);
  }
}

export async function createCheckout(items: { variantId: string; quantity: number }[], customerInfo: Record<string, string>) {
  try {
    const data = await shopifyFetch<ShopifyCheckoutResponse>(`
      mutation CreateCheckout($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            message
          }
        }
      }
    `, {
      input: {
        lineItems: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName: customerInfo.fullName,
          phone: customerInfo.phone,
          city: customerInfo.city,
          address1: customerInfo.address,
          country: 'Morocco',
        },
        customAttributes: [
          { key: 'payment_method', value: 'cash_on_delivery' },
          { key: 'notes', value: customerInfo.notes || '' },
        ],
      },
    });

    if (data.checkoutCreate.checkoutUserErrors?.length) {
      throw new Error(data.checkoutCreate.checkoutUserErrors.map((e) => e.message).join(', '));
    }

    return {
      id: data.checkoutCreate.checkout?.id || '',
      url: data.checkoutCreate.checkout?.webUrl || '',
    };
  } catch (error) {
    throw error;
  }
}

// Local fallback data
const CATEGORY_DATA: Record<string, { handle: string; image: string; productCount: number; title: Record<'ar' | 'fr' | 'en', string>; description: Record<'ar' | 'fr' | 'en', string> }> = {
  'cat-kitchen': { handle: 'kitchen', image: 'https://images.pexels.com/photos/3737599/pexels-photo-3737599.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 7,
    title: { ar: 'المطبخ', fr: 'Cuisine', en: 'Kitchen' },
    description: { ar: 'أدوات ومستلزمات مطبخية عالية الجودة لتجربة طهي مريحة وفعالة.', fr: 'Des ustensiles de cuisine de qualité pour une expérience culinaire agréable et efficace.', en: 'High-quality kitchen tools and essentials for a comfortable, efficient cooking experience.' } },
  'cat-beauty': { handle: 'beauty', image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 6,
    title: { ar: 'الصحة والجمال', fr: 'Santé & Beauté', en: 'Health & Beauty' },
    description: { ar: 'منتجات العناية والجمال للحفاظ على إطلالة رائعة.', fr: 'Des produits de soin et de beauté pour un look toujours impeccable.', en: 'Care and beauty products to keep you looking your best.' } },
  'cat-kids': { handle: 'kids', image: 'https://images.pexels.com/photos/3661193/pexels-photo-3661193.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 5,
    title: { ar: 'منتجات الأطفال', fr: 'Produits pour enfants', en: 'Kids Products' },
    description: { ar: 'كل ما يحتاجه طفلك من منتجات آمنة وعالية الجودة.', fr: 'Tout ce dont votre enfant a besoin, sûr et de haute qualité.', en: 'Everything your child needs — safe and high quality.' } },
  'cat-electronics': { handle: 'electronics', image: 'https://images.pexels.com/photos/3933251/pexels-photo-3933251.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 6,
    title: { ar: 'الإلكترونيات الذكية', fr: 'Électronique intelligente', en: 'Smart Electronics' },
    description: { ar: 'أحدث الأجهزة الإلكترونية الذكية لتبسيط حياتك.', fr: 'Les derniers appareils électroniques intelligents pour simplifier votre vie.', en: 'The latest smart electronic devices to simplify your life.' } },
  'cat-fashion': { handle: 'fashion', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 5,
    title: { ar: 'الأزياء والإكسسوارات', fr: 'Mode & Accessoires', en: 'Fashion & Accessories' },
    description: { ar: 'أحدث صيحات الموضة والإكسسوارات بأناقة عالية.', fr: 'Les dernières tendances mode et accessoires avec élégance.', en: 'The latest fashion trends and accessories, styled with elegance.' } },
  'cat-home': { handle: 'home-decor', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 4,
    title: { ar: 'المنزل والديكور', fr: 'Maison & Déco', en: 'Home & Decor' },
    description: { ar: 'لمسات ديكورية أنيقة تجعل منزلك أكثر دفئاً وجمالاً.', fr: 'Des touches déco élégantes qui rendent votre maison plus chaleureuse et belle.', en: 'Elegant decor touches that make your home warmer and more beautiful.' } },
  'cat-sports': { handle: 'sports', image: 'https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 4,
    title: { ar: 'الرياضة واللياقة', fr: 'Sport & Fitness', en: 'Sports & Fitness' },
    description: { ar: 'معدات وملحقات رياضية لمساعدتك على البقاء في أفضل حالة.', fr: 'Équipements et accessoires sportifs pour rester en pleine forme.', en: 'Sports gear and accessories to help you stay in top shape.' } },
  'cat-pets': { handle: 'pets', image: 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 3,
    title: { ar: 'الحيوانات الأليفة', fr: 'Animaux de compagnie', en: 'Pets' },
    description: { ar: 'كل ما يحتاجه صديقك الوفي من منتجات للعناية والترفيه.', fr: 'Tout ce dont votre fidèle compagnon a besoin pour ses soins et ses loisirs.', en: 'Everything your loyal companion needs for care and play.' } },
};

export function getLocalCategories(locale: 'ar' | 'fr' | 'en' = 'ar'): Category[] {
  return Object.entries(CATEGORY_DATA).map(([id, c]) => ({
    id,
    title: c.title[locale],
    handle: c.handle,
    description: c.description[locale],
    image: c.image,
    productCount: c.productCount,
  }));
}

export function getLocalProducts(): Product[] {
  return [
    {
      id: 'p1', title: 'رف تخزين الأطباق متعدد الوظائف', handle: 'dish-storage-rack',
      description: 'رف تخزين الأطباق متعدد الوظائف مصنوع من مواد عالية الجودة، يوفر مساحة كبيرة في مطبخك ويسمح بتنظيم الأطباق والأكواب بكفاءة. سهل التركيب ومتين.',
      category: 'المطبخ', categoryHandle: 'kitchen', price: 189, compareAtPrice: 299, currency: 'MAD',
      images: [
        { id: 'p1i1', url: 'https://images.pexels.com/photos/3737599/pexels-photo-3737599.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p1i2', url: 'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p1v1', title: 'افتراضي', price: 189, compareAtPrice: 299, available: true }],
      rating: 4.7, reviewCount: 124, tags: ['featured', 'best-seller', 'sale'], isFeatured: true, isBestSeller: true, isOnSale: true, available: true,
    },
    {
      id: 'p2', title: 'رشاش حديقة محمول عالي الضغط مع رأس قابل للتعديل', handle: 'garden-spray',
      description: 'رشاش حديقة محمول عالي الضغط مع رأس قابل للتعديل، مثالي لري الحديقة وغسيل السيارة. خفيف الوزن وسهل الاستخدام.',
      category: 'المطبخ', categoryHandle: 'kitchen', price: 149, compareAtPrice: 229, currency: 'MAD',
      images: [
        { id: 'p2i1', url: 'https://images.pexels.com/photos/4503267/pexels-photo-4503267.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p2i2', url: 'https://images.pexels.com/photos/4503271/pexels-photo-4503271.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p2v1', title: 'افتراضي', price: 149, compareAtPrice: 229, available: true }],
      rating: 4.5, reviewCount: 87, tags: ['featured', 'best-seller', 'sale'], isFeatured: true, isBestSeller: true, isOnSale: true, available: true,
    },
    {
      id: 'p3', title: 'خزائن متعددة الطبقات مع أبواب شفافة', handle: 'storage-cabinets',
      description: 'خزائن متعددة الطبقات مع أبواب شفافة، مثالية لتنظيم الملابس والأدوات في غرف النوم والمطابخ. تصميم أنيق ومتين.',
      category: 'المطبخ', categoryHandle: 'kitchen', price: 259, compareAtPrice: 399, currency: 'MAD',
      images: [
        { id: 'p3i1', url: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p3i2', url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p3v1', title: 'افتراضي', price: 259, compareAtPrice: 399, available: true }],
      rating: 4.6, reviewCount: 56, tags: ['featured', 'best-seller', 'sale'], isFeatured: true, isBestSeller: true, isOnSale: true, available: true,
    },
    {
      id: 'p4', title: 'جهاز تدريبي لتمارين الإطالة وتقوية الأرجل', handle: 'leg-stretcher',
      description: 'جهاز تدريبي لتمارين الإطالة وتقوية الأرجل، يساعد على تحسين المرونة والتوازن. مناسب لجميع الأعمار وسهل الاستخدام في المنزل.',
      category: 'الصحة والجمال', categoryHandle: 'beauty', price: 199, compareAtPrice: 349, currency: 'MAD',
      images: [
        { id: 'p4i1', url: 'https://images.pexels.com/photos/4498484/pexels-photo-4498484.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p4i2', url: 'https://images.pexels.com/photos/4498542/pexels-photo-4498542.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p4v1', title: 'افتراضي', price: 199, compareAtPrice: 349, available: true }],
      rating: 4.4, reviewCount: 42, tags: ['featured', 'best-seller', 'sale'], isFeatured: true, isBestSeller: true, isOnSale: true, available: true,
    },
    {
      id: 'p5', title: 'نظارات قراءة مضادة للأشعة الزرقاء بمعدن قابل للطَي', handle: 'blue-light-glasses',
      description: 'نظارات قراءة مضادة للأشعة الزرقاء بإطار معدني قابل للطي، تحمي عينيك من التعب أثناء استخدام الأجهزة الإلكترونية. خفيفة وأنيقة.',
      category: 'الإلكترونيات الذكية', categoryHandle: 'electronics', price: 89, compareAtPrice: 159, currency: 'MAD',
      images: [
        { id: 'p5i1', url: 'https://images.pexels.com/photos/887539/pexels-photo-887539.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p5i2', url: 'https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p5v1', title: '+1.0', price: 89, compareAtPrice: 159, available: true }, { id: 'p5v2', title: '+1.5', price: 89, compareAtPrice: 159, available: true }, { id: 'p5v3', title: '+2.0', price: 89, compareAtPrice: 159, available: true }],
      rating: 4.8, reviewCount: 156, tags: ['featured', 'best-seller', 'sale'], isFeatured: true, isBestSeller: true, isOnSale: true, available: true,
    },
    {
      id: 'p6', title: 'جهاز الغسيل بالضغط المحمول مع خزان مياه', handle: 'portable-washer',
      description: 'جهاز الغسيل بالضغط المحمول مع خزان مياه، مثالي للغسيل السريع والفعال في أي مكان. خفيف الوزن وسهل الحمل.',
      category: 'المطبخ', categoryHandle: 'kitchen', price: 329, compareAtPrice: 499, currency: 'MAD',
      images: [
        { id: 'p6i1', url: 'https://images.pexels.com/photos/4239036/pexels-photo-4239036.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p6i2', url: 'https://images.pexels.com/photos/4239037/pexels-photo-4239037.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p6v1', title: 'افتراضي', price: 329, compareAtPrice: 499, available: true }],
      rating: 4.3, reviewCount: 34, tags: ['featured', 'best-seller', 'sale'], isFeatured: true, isBestSeller: true, isOnSale: true, available: true,
    },
    {
      id: 'p7', title: 'جهاز مساج كهربائي للرقبة والكتفين', handle: 'neck-massager',
      description: 'جهاز مساج كهربائي للرقبة والكتفين، يوفر راحة فورية من التوتر والألم. يعمل بالشحن USB وله أوضاع متعددة.',
      category: 'الصحة والجمال', categoryHandle: 'beauty', price: 249, compareAtPrice: 399, currency: 'MAD',
      images: [
        { id: 'p7i1', url: 'https://images.pexels.com/photos/4498484/pexels-photo-4498484.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p7i2', url: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p7v1', title: 'افتراضي', price: 249, compareAtPrice: 399, available: true }],
      rating: 4.6, reviewCount: 78, tags: ['featured', 'sale'], isFeatured: true, isBestSeller: false, isOnSale: true, available: true,
    },
    {
      id: 'p8', title: 'ساعة ذكية رياضية مقاومة للماء', handle: 'smart-watch',
      description: 'ساعة ذكية رياضية مقاومة للماء، تتبع النشاط البدني ونبضات القلب والنوم. شاشة لمس عالية الدقة وعمر بطارية طويل.',
      category: 'الإلكترونيات الذكية', categoryHandle: 'electronics', price: 379, compareAtPrice: 599, currency: 'MAD',
      images: [
        { id: 'p8i1', url: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p8i2', url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p8v1', title: 'أسود', price: 379, compareAtPrice: 599, available: true }, { id: 'p8v2', title: 'فضي', price: 379, compareAtPrice: 599, available: true }],
      rating: 4.7, reviewCount: 203, tags: ['featured', 'best-seller', 'sale'], isFeatured: true, isBestSeller: true, isOnSale: true, available: true,
    },
    {
      id: 'p9', title: 'طقم أواني طبخ من الجرانيت 10 قطع', handle: 'granite-cookware',
      description: 'طقم أواني طبخ من الجرانيت 10 قطع، مقاوم للالتصاق وآمن للاستخدام على جميع أنواع المواقد. تصميم أنيق ومتين.',
      category: 'المطبخ', categoryHandle: 'kitchen', price: 449, compareAtPrice: 699, currency: 'MAD',
      images: [
        { id: 'p9i1', url: 'https://images.pexels.com/photos/4226806/pexels-photo-4226806.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p9i2', url: 'https://images.pexels.com/photos/4226819/pexels-photo-4226819.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p9v1', title: 'افتراضي', price: 449, compareAtPrice: 699, available: true }],
      rating: 4.5, reviewCount: 91, tags: ['sale'], isFeatured: false, isBestSeller: false, isOnSale: true, available: true,
    },
    {
      id: 'p10', title: 'حقيبة ظهر مدرسية مقاومة للماء للأطفال', handle: 'kids-backpack',
      description: 'حقيبة ظهر مدرسية مقاومة للماء للأطفال، مصممة لتوفير الراحة وتدعيم الظهر. مساحات تخزين كبيرة وتصميم مرح.',
      category: 'منتجات الأطفال', categoryHandle: 'kids', price: 129, compareAtPrice: 199, currency: 'MAD',
      images: [
        { id: 'p10i1', url: 'https://images.pexels.com/photos/1292307/pexels-photo-1292307.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p10i2', url: 'https://images.pexels.com/photos/1182074/pexels-photo-1182074.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p10v1', title: 'أزرق', price: 129, compareAtPrice: 199, available: true }, { id: 'p10v2', title: 'وردي', price: 129, compareAtPrice: 199, available: true }],
      rating: 4.6, reviewCount: 67, tags: ['featured', 'sale'], isFeatured: true, isBestSeller: false, isOnSale: true, available: true,
    },
    {
      id: 'p11', title: 'مصباح ليلي ذكي بحركة للأطفال', handle: 'kids-night-light',
      description: 'مصباح ليلي ذكي يعمل بالحركة للأطفال، يوفر إضاءة لطيفة ليلًا. يعمل بالشحن USB وآمن للاستخدام في غرف الأطفال.',
      category: 'منتجات الأطفال', categoryHandle: 'kids', price: 79, compareAtPrice: 129, currency: 'MAD',
      images: [
        { id: 'p11i1', url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p11i2', url: 'https://images.pexels.com/photos/1112597/pexels-photo-1112597.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p11v1', title: 'افتراضي', price: 79, compareAtPrice: 129, available: true }],
      rating: 4.4, reviewCount: 45, tags: ['sale'], isFeatured: false, isBestSeller: false, isOnSale: true, available: true,
    },
    {
      id: 'p12', title: 'سماعة بلوتوث لاسلكية بعزل الضجيج', handle: 'wireless-headphones',
      description: 'سماعة بلوتوث لاسلكية بعزل الضجيج، صوت نقي عالي الجودة وبطارية تدوم 40 ساعة. مريحة للاستخدام الطويل.',
      category: 'الإلكترونيات الذكية', categoryHandle: 'electronics', price: 299, compareAtPrice: 499, currency: 'MAD',
      images: [
        { id: 'p12i1', url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p12i2', url: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p12v1', title: 'أسود', price: 299, compareAtPrice: 499, available: true }, { id: 'p12v2', title: 'أبيض', price: 299, compareAtPrice: 499, available: true }],
      rating: 4.8, reviewCount: 287, tags: ['featured', 'best-seller', 'sale'], isFeatured: true, isBestSeller: true, isOnSale: true, available: true,
    },
    {
      id: 'p13', title: 'كريم مرطب طبيعي للبشرة بفيتامين E', handle: 'moisturizer-cream',
      description: 'كريم مرطب طبيعي للبشرة غني بفيتامين E، يرطب البشرة بعمق ويحميها من الجفاف. مناسب لجميع أنواع البشرة.',
      category: 'الصحة والجمال', categoryHandle: 'beauty', price: 99, compareAtPrice: 179, currency: 'MAD',
      images: [
        { id: 'p13i1', url: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p13i2', url: 'https://images.pexels.com/photos/5938567/pexels-photo-5938567.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p13v1', title: '50ml', price: 99, compareAtPrice: 179, available: true }],
      rating: 4.5, reviewCount: 112, tags: ['sale'], isFeatured: false, isBestSeller: false, isOnSale: true, available: true,
    },
    {
      id: 'p14', title: 'حذاء رياضي عصري للنساء', handle: 'womens-sneakers',
      description: 'حذاء رياضي عصري للنساء، مريح وخفيف الوزن. مناسب للمشي والرياضة والاستخدام اليومي. تصميم أنيق وعصري.',
      category: 'الأزياء والإكسسوارات', categoryHandle: 'fashion', price: 219, compareAtPrice: 349, currency: 'MAD',
      images: [
        { id: 'p14i1', url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p14i2', url: 'https://images.pexels.com/photos/1456736/pexels-photo-1456736.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [
        { id: 'p14v1', title: '36', price: 219, compareAtPrice: 349, available: true },
        { id: 'p14v2', title: '37', price: 219, compareAtPrice: 349, available: true },
        { id: 'p14v3', title: '38', price: 219, compareAtPrice: 349, available: true },
        { id: 'p14v4', title: '39', price: 219, compareAtPrice: 349, available: true },
        { id: 'p14v5', title: '40', price: 219, compareAtPrice: 349, available: true },
      ],
      rating: 4.6, reviewCount: 89, tags: ['featured', 'sale'], isFeatured: true, isBestSeller: false, isOnSale: true, available: true,
    },
    {
      id: 'p15', title: 'ساعة يد أنيقة للرجال', handle: 'mens-watch',
      description: 'ساعة يد أنيقة للرجال بتصميم كلاسيكي، مقاومة للماء. حركة دقيقة وتاج من الستانلس ستيل.',
      category: 'الأزياء والإكسسوارات', categoryHandle: 'fashion', price: 259, compareAtPrice: 449, currency: 'MAD',
      images: [
        { id: 'p15i1', url: 'https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p15i2', url: 'https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p15v1', title: 'أسود', price: 259, compareAtPrice: 449, available: true }, { id: 'p15v2', title: 'فضي', price: 259, compareAtPrice: 449, available: true }],
      rating: 4.7, reviewCount: 134, tags: ['best-seller', 'sale'], isFeatured: false, isBestSeller: true, isOnSale: true, available: true,
    },
    {
      id: 'p16', title: 'لعبة تعليمية تفاعلية للأطفال', handle: 'educational-toy',
      description: 'لعبة تعليمية تفاعلية للأطفال، تساعد على تطوير المهارات الحركية والذهنية. آمنة ومصنوعة من مواد غير سامة.',
      category: 'منتجات الأطفال', categoryHandle: 'kids', price: 159, compareAtPrice: 249, currency: 'MAD',
      images: [
        { id: 'p16i1', url: 'https://images.pexels.com/photos/3661193/pexels-photo-3661193.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p16i2', url: 'https://images.pexels.com/photos/3661358/pexels-photo-3661358.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p16v1', title: 'افتراضي', price: 159, compareAtPrice: 249, available: true }],
      rating: 4.5, reviewCount: 56, tags: ['sale'], isFeatured: false, isBestSeller: false, isOnSale: true, available: true,
    },
    {
      id: 'p17', title: 'مصباح طاولة LED بتصميم عصري', handle: 'led-table-lamp',
      description: 'مصباح طاولة LED بتصميم عصري، إضاءة قابلة للتعديل بثلاث درجات. مثالي للمكتب وغرفة النوم. موفر للطاقة.',
      category: 'المنزل والديكور', categoryHandle: 'home-decor', price: 139, compareAtPrice: 219, currency: 'MAD',
      images: [
        { id: 'p17i1', url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p17i2', url: 'https://images.pexels.com/photos/1726208/pexels-photo-1726208.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p17v1', title: 'افتراضي', price: 139, compareAtPrice: 219, available: true }],
      rating: 4.6, reviewCount: 72, tags: ['featured', 'sale'], isFeatured: true, isBestSeller: false, isOnSale: true, available: true,
    },
    {
      id: 'p18', title: 'نبات صناعي واقعي في أصيص أنيق', handle: 'artificial-plant',
      description: 'نبات صناعي واقعي في أصيص أنيق، يضيف لمسة خضراء لمنزلك دون عناء العناية. مثالي للديكور الداخلي.',
      category: 'المنزل والديكور', categoryHandle: 'home-decor', price: 99, compareAtPrice: 169, currency: 'MAD',
      images: [
        { id: 'p18i1', url: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p18i2', url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p18v1', title: 'افتراضي', price: 99, compareAtPrice: 169, available: true }],
      rating: 4.3, reviewCount: 38, tags: ['sale'], isFeatured: false, isBestSeller: false, isOnSale: true, available: true,
    },
    {
      id: 'p19', title: 'حبل قفز قابل للتعديل مع عداد رقمي', handle: 'jump-rope',
      description: 'حبل قفز قابل للتعديل مع عداد رقمي تلقائي، مثالي لتمارين الكارديو. خفيف الوزن ومريح القبضة.',
      category: 'الرياضة واللياقة', categoryHandle: 'sports', price: 69, compareAtPrice: 119, currency: 'MAD',
      images: [
        { id: 'p19i1', url: 'https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p19i2', url: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p19v1', title: 'افتراضي', price: 69, compareAtPrice: 119, available: true }],
      rating: 4.5, reviewCount: 54, tags: ['featured', 'best-seller', 'sale'], isFeatured: true, isBestSeller: true, isOnSale: true, available: true,
    },
    {
      id: 'p20', title: 'حصادة يوغا مانعة للانزلاق', handle: 'yoga-mat',
      description: 'حصادة يوغا مانعة للانزلاق، سميكة ومريحة. مصنوعة من مواد صديقة للبيئة. مثالية لتمارين اليوغا والتمدد.',
      category: 'الرياضة واللياقة', categoryHandle: 'sports', price: 119, compareAtPrice: 199, currency: 'MAD',
      images: [
        { id: 'p20i1', url: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p20i2', url: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p20v1', title: 'بنفسجي', price: 119, compareAtPrice: 199, available: true }, { id: 'p20v2', title: 'أزرق', price: 119, compareAtPrice: 199, available: true }],
      rating: 4.7, reviewCount: 98, tags: ['sale'], isFeatured: false, isBestSeller: false, isOnSale: true, available: true,
    },
    {
      id: 'p21', title: 'فرشاة تنظيف شعر الحيوانات الأليفة', handle: 'pet-brush',
      description: 'فرشاة تنظيف شعر الحيوانات الأليفة، تزيل الشعر الزائد بسهولة. مريحة للقبضة وآمنة على بشرة الحيوان.',
      category: 'الحيوانات الأليفة', categoryHandle: 'pets', price: 59, compareAtPrice: 99, currency: 'MAD',
      images: [
        { id: 'p21i1', url: 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p21i2', url: 'https://images.pexels.com/photos/4587992/pexels-photo-4587992.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p21v1', title: 'افتراضي', price: 59, compareAtPrice: 99, available: true }],
      rating: 4.4, reviewCount: 41, tags: ['sale'], isFeatured: false, isBestSeller: false, isOnSale: true, available: true,
    },
    {
      id: 'p22', title: 'وعاء طعام تلقائي للحيوانات الأليفة', handle: 'pet-feeder',
      description: 'وعاء طعام تلقائي للحيوانات الأليفة، يوفر الطعام في أوقات محددة. سعة كبيرة وشاشة LCD لضبط الجدول.',
      category: 'الحيوانات الأليفة', categoryHandle: 'pets', price: 279, compareAtPrice: 449, currency: 'MAD',
      images: [
        { id: 'p22i1', url: 'https://images.pexels.com/photos/4587955/pexels-photo-4587955.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { id: 'p22i2', url: 'https://images.pexels.com/photos/4587992/pexels-photo-4587992.jpeg?auto=compress&cs=tinysrgb&w=800' },
      ],
      variants: [{ id: 'p22v1', title: 'افتراضي', price: 279, compareAtPrice: 449, available: true }],
      rating: 4.6, reviewCount: 33, tags: ['featured', 'sale'], isFeatured: true, isBestSeller: false, isOnSale: true, available: true,
    },
  ];
}

// TypeScript interfaces for Shopify raw responses
interface ShopifyRawVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  availableForSale: boolean;
  sku: string | null;
}

interface ShopifyRawImage {
  id: string | null;
  url: string;
  altText: string | null;
}

interface ShopifyRawProduct {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  descriptionHtml: string | null;
  productType: string | null;
  tags: string[];
  images: { edges: Array<{ node: ShopifyRawImage }> };
  variants: { edges: Array<{ node: ShopifyRawVariant }> };
}

interface ShopifyProductsResponse {
  products: { edges: Array<{ node: ShopifyRawProduct }> };
}

interface ShopifyProductResponse {
  productByHandle: ShopifyRawProduct | null;
}

interface ShopifyCollectionResponse {
  collectionByHandle: { products: { edges: Array<{ node: ShopifyRawProduct }> } } | null;
}

interface ShopifyCollectionsResponse {
  collections: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        description: string | null;
        image: { url: string } | null;
        productsCount: number | null;
      };
    }>;
  };
}

interface ShopifyCheckoutResponse {
  checkoutCreate: {
    checkout: { id: string; webUrl: string } | null;
    checkoutUserErrors: Array<{ message: string }>;
  };
}
