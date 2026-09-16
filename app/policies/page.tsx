import Link from 'next/link';
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <div className="bg-mesh min-h-screen">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <ArrowRight className="h-3.5 w-3.5" />
          <span>الشروط والسياسات</span>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-primary mb-2">نحرص على راحتك</p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">الشروط والسياسات</h1>
            <p className="text-muted-foreground">كل ما تحتاج معرفته قبل وبعد إتمام طلبك.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Truck, title: 'التوصيل', text: 'يصل طلبك خلال 24-48 ساعة لجميع مدن المغرب.' },
              { icon: RotateCcw, title: 'الاستبدال والإرجاع', text: 'يمكنك طلب الإرجاع خلال 7 أيام من الاستلام.' },
              { icon: ShieldCheck, title: 'الخصوصية', text: 'نحافظ على معلوماتك ولا نشاركها مع أي جهة.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border bg-card p-5 text-center shadow-card">
                <item.icon className="mx-auto h-7 w-7 text-primary mb-3" />
                <h2 className="font-heading font-bold mb-2">{item.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border bg-card p-6 md:p-10 shadow-card space-y-8">
            <section><h2 className="font-heading text-xl font-bold mb-3">سياسة الاستبدال والاسترجاع</h2><p className="text-sm leading-loose text-muted-foreground">نقبل طلبات الاسترجاع خلال سبعة أيام من تاريخ استلام المنتج، بشرط أن يكون المنتج غير مستخدم وفي حالته الأصلية مع التغليف. تواصل معنا قبل إرسال أي منتج حتى نساعدك في الخطوات التالية.</p></section>
            <section><h2 className="font-heading text-xl font-bold mb-3">سياسة التوصيل</h2><p className="text-sm leading-loose text-muted-foreground">نقوم بتوصيل الطلبات خلال 24 إلى 48 ساعة حسب المدينة. التوصيل مجاني للطلبات التي تتجاوز 500 درهم، وتبلغ رسوم التوصيل 35 درهم للطلبات الأقل من ذلك.</p></section>
            <section><h2 className="font-heading text-xl font-bold mb-3">الخصوصية والدفع</h2><p className="text-sm leading-loose text-muted-foreground">نستخدم معلوماتك فقط لتأكيد الطلب وتوصيله. الدفع عند الاستلام متاح لجميع الطلبات، ولا نطلب منك إدخال معلومات بطاقتك البنكية.</p></section>
          </div>
        </div>
      </div>
    </div>
  );
}
