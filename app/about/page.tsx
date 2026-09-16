import { ShieldCheck, Truck, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-mesh min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-primary font-bold">مرحباً بك في YaraMall</span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-6">تسوق بثقة، استلم بسهولة</h1>
          <p className="text-lg text-muted-foreground leading-loose">نحن متجر مغربي شامل نؤمن بأن التسوق الإلكتروني يجب أن يكون بسيطاً، موثوقاً ومتاحاً للجميع. نختار لك أفضل المنتجات ونوصلها إلى باب منزلك.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-5 max-w-5xl mx-auto mt-14">
          {[
            { icon: Heart, title: 'نحب عملاءنا', desc: 'رضاك هو أولويتنا دائماً' },
            { icon: ShieldCheck, title: 'جودة مضمونة', desc: 'منتجات مختارة بعناية' },
            { icon: Truck, title: 'توصيل سريع', desc: 'نصل إليك في 24-48 ساعة' },
            { icon: Users, title: 'فريق متخصص', desc: 'نحن هنا لمساعدتك' },
          ].map((s) => (
            <div key={s.title} className="text-center p-6 border rounded-2xl bg-card shadow-card">
              <s.icon className="h-8 w-8 mx-auto text-primary mb-3" />
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
