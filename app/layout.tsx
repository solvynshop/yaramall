import './globals.css';
import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import { I18nProvider } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale-server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/layout/cart-drawer';
import { AnnouncementBar } from '@/components/layout/announcement-bar';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic', 'latin'], variable: '--font-ibm-arabic', weight: ['300', '400', '500', '600', '700'], display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', weight: ['400', '500', '600', '700', '800'], display: 'swap' });

const metadataByLocale: Record<string, { title: string; description: string }> = {
  ar: {
    title: 'YaraMall | متجر شامل ومتعدد الفئات في المغرب - الدفع عند الاستلام',
    description: 'تسوق أفضل المنتجات في المغرب مع الدفع عند الاستلام والتوصيل السريع 24-48 ساعة. المطبخ، الصحة والجمال، الإلكترونيات، الأزياء والمزيد.',
  },
  fr: {
    title: 'YaraMall | Votre boutique multi-catégories au Maroc - Paiement à la livraison',
    description: 'Achetez les meilleurs produits au Maroc avec paiement à la livraison et livraison rapide en 24-48h. Cuisine, Santé et Beauté, Électronique, Mode et plus encore.',
  },
  en: {
    title: 'YaraMall | Your All-in-One Store in Morocco - Cash on Delivery',
    description: 'Shop the best products in Morocco with cash on delivery and fast 24-48h shipping. Kitchen, Health & Beauty, Electronics, Fashion & more.',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const m = metadataByLocale[locale] ?? metadataByLocale.en;

  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
      images: [{ url: '/og-image.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [{ url: '/og-image.png' }],
    },
  };
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${ibmPlexArabic.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased">
        <I18nProvider initialLocale={locale}>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
