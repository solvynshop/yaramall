'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-mesh min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">اتصل بنا</h1>
            <p className="text-muted-foreground">فريقنا هنا لمساعدتك، أرسل لنا رسالتك وسنرد عليك في أقرب وقت.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              {[
                { icon: Phone, title: 'الهاتف', text: '+212 600 000 000' },
                { icon: Mail, title: 'البريد الإلكتروني', text: 'contact@yaramall.ma' },
                { icon: MapPin, title: 'العنوان', text: 'الدار البيضاء، المغرب' },
              ].map((x) => (
                <div key={x.title} className="flex gap-3 p-4 border rounded-2xl bg-card shadow-card items-center">
                  <x.icon className="h-5 w-5 text-primary shrink-0" />
                  <div><h3 className="font-bold text-sm">{x.title}</h3><p className="text-sm text-muted-foreground mt-1">{x.text}</p></div>
                </div>
              ))}
            </div>

            {sent ? (
              <div className="md:col-span-2 flex flex-col items-center justify-center border rounded-2xl bg-card p-10 text-center shadow-card">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="font-bold text-xl mb-2">تم إرسال رسالتك</h2>
                <p className="text-muted-foreground">شكراً لتواصلك معنا، سنرد عليك قريباً.</p>
              </div>
            ) : (
              <form className="md:col-span-2 space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <Input required placeholder="الاسم الكامل" />
                <Input required type="email" placeholder="البريد الإلكتروني" />
                <Input required placeholder="موضوع الرسالة" />
                <Textarea required placeholder="اكتب رسالتك هنا..." rows={5} />
                <Button type="submit" className="w-full rounded-xl font-bold">إرسال الرسالة</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
