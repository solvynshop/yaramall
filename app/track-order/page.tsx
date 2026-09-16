'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PackageCheck } from 'lucide-react';

export default function TrackOrderPage() {
  const [searched, setSearched] = useState(false);

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-5">
            <PackageCheck className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-3">تتبع طلبك</h1>
          <p className="text-muted-foreground mb-8">أدخل رقم الطلب لمعرفة حالة شحنتك</p>
          <form onSubmit={(e) => { e.preventDefault(); setSearched(true); }} className="flex gap-2 max-w-md mx-auto">
            <Input required placeholder="مثال: YM-123456" />
            <Button type="submit"><Search className="h-4 w-4 ml-2" /> بحث</Button>
          </form>
          {searched && (
            <div className="mt-8 rounded-2xl border bg-card p-5 shadow-card animate-scale-in">
              <p className="font-bold text-primary mb-2">طلبك قيد المعالجة</p>
              <p className="text-sm text-muted-foreground">سنتصل بك قريباً لتأكيد الطلب وبدء التوصيل.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
