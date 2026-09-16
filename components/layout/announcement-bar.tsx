'use client';
import { useI18n } from '@/lib/i18n';

export function AnnouncementBar() {
  const { t } = useI18n();
  const messages = [
    t('trust.fastDelivery'),
    t('trust.cod'),
    t('trust.quality'),
    t('trust.support'),
  ];

  return (
    <div className="bg-foreground text-background overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2.5">
        {[...messages, ...messages, ...messages, ...messages].map((msg, i) => (
          <span key={i} className="mx-6 text-xs font-medium flex items-center gap-2 opacity-90">
            {msg}
            <span className="opacity-40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
