import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQPage() {
  const faqs = [
    ['كيف يمكنني الدفع؟', 'نوفر لك الدفع عند الاستلام. ادفع نقداً عند وصول طلبك إلى باب منزلك.'],
    ['متى سيصل طلبي؟', 'يتم توصيل الطلبات خلال 24 إلى 48 ساعة حسب المدينة.'],
    ['هل التوصيل مجاني؟', 'التوصيل مجاني للطلبات التي تتجاوز 500 درهم، وإلا فتبلغ رسوم التوصيل 35 درهم.'],
    ['هل يمكنني إرجاع المنتج؟', 'نعم، يمكنك التواصل معنا خلال 7 أيام من استلام الطلب لطلب الإرجاع.'],
    ['كيف أتتبع طلبي؟', 'استخدم صفحة تتبع الطلب وأدخل رقم الطلب الذي يصلك بعد التأكيد.'],
  ];

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">الأسئلة الشائعة</h1>
          <p className="text-muted-foreground">كل ما تحتاج معرفته عن التسوق في YaraMall</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map(([q, a], i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-right font-bold">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
