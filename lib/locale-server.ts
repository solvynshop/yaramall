import { cookies, headers } from 'next/headers';
import type { Locale } from './i18n';

function detectFromAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return 'en';
  const primary = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
  if (primary === 'ar') return 'ar';
  if (primary === 'fr') return 'fr';
  return 'en';
}

/**
 * Resolves the active locale for a server component: prefers the visitor's
 * explicit past choice (cookie), and otherwise detects from their browser's
 * language, defaulting to English/LTR rather than Arabic/RTL when unknown.
 */
export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('yaramall-locale')?.value as Locale | undefined;
  if (cookieLocale && ['ar', 'fr', 'en'].includes(cookieLocale)) return cookieLocale;

  const headersList = await headers();
  return detectFromAcceptLanguage(headersList.get('accept-language'));
}
