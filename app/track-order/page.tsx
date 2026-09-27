'use client';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PackageCheck } from 'lucide-react';

// NOTE: this is still a UI placeholder — it does not look up a real order.
// Wiring this up for real requires a server-side API route using the Supabase
// SERVICE ROLE key (never the anon key), so a lookup can be scoped to one
// order at a time without exposing broad SELECT access to the browser.
export default function TrackOrderPage() {
  const { t } = useI18n();
  const [searched, setSearched] = useState(false);

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-5">
            <PackageCheck className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-3">{t('track.heading')}</h1>
          <p className="text-muted-foreground mb-8">{t('track.subheading')}</p>
          <form onSubmit={(e) => { e.preventDefault(); setSearched(true); }} className="flex gap-2 max-w-md mx-auto">
            <Input required placeholder={t('track.placeholder')} />
            <Button type="submit"><Search className="h-4 w-4 me-2" /> {t('track.search')}</Button>
          </form>
          {searched && (
            <div className="mt-8 rounded-2xl border bg-card p-5 shadow-card animate-scale-in">
              <p className="font-bold text-primary mb-2">{t('track.processing')}</p>
              <p className="text-sm text-muted-foreground">{t('track.willCallSoon')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
