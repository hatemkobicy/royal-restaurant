import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

// Form schema
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  date: z.string().min(1, {
    message: "Date is required.",
  }),
  time: z.string().min(1, {
    message: "Time is required.",
  }),
  people: z.string().min(1, {
    message: "Number of people is required.",
  }),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form default values
  const defaultValues: Partial<ContactFormValues> = {
    name: "",
    phone: "",
    date: "",
    time: "",
    people: "",
    notes: "",
  };

  // Form setup
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  // Form submission handler
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate form submission with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: language === 'ar' ? "تم تأكيد حجزك بنجاح!" : "Your reservation has been confirmed!",
        description: language === 'ar' 
          ? `سنتواصل معك على ${data.phone} قبل موعد الحجز.` 
          : `We will contact you at ${data.phone} before your reservation.`,
        variant: "default",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      // Show error message
      toast({
        title: language === 'ar' ? "حدث خطأ!" : "An error occurred!",
        description: language === 'ar' 
          ? "لم نتمكن من تأكيد حجزك. يرجى المحاولة مرة أخرى." 
          : "We couldn't confirm your reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="h-[300px] md:h-[400px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" 
            alt="Contact us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('contact.title')}</h1>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-lg text-foreground max-w-3xl mx-auto">{t('contact.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <Card className="bg-gray-50 mb-6">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-secondary mb-6">{t('contact.info.title')}</h3>
                  
                  <div className="flex items-start mb-4">
                    <i className={`bi bi-geo-alt text-primary text-xl mt-1 ${isRtl ? 'ml-3' : 'mr-3'}`}></i>
                    <div>
                      <h4 className="font-bold">{t('contact.address.title')}</h4>
                      <p className="text-foreground">{t('contact.address.value')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <i className={`bi bi-telephone text-primary text-xl mt-1 ${isRtl ? 'ml-3' : 'mr-3'}`}></i>
                    <div>
                      <h4 className="font-bold">{t('contact.phone.title')}</h4>
                      <p className="text-foreground">{t('contact.phone.value')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <i className={`bi bi-envelope text-primary text-xl mt-1 ${isRtl ? 'ml-3' : 'mr-3'}`}></i>
                    <div>
                      <h4 className="font-bold">{t('contact.email.title')}</h4>
                      <p className="text-foreground">{t('contact.email.value')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <i className={`bi bi-clock text-primary text-xl mt-1 ${isRtl ? 'ml-3' : 'mr-3'}`}></i>
                    <div>
                      <h4 className="font-bold">{t('contact.hours.title')}</h4>
                      <p className="text-foreground">{t('contact.hours.value')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-secondary mb-6">{t('contact.social.title')}</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90 transition">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90 transition">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90 transition">
                      <i className="bi bi-youtube"></i>
                    </a>
                    <a href="#" className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90 transition">
                      <i className="bi bi-twitter"></i>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <div className="mt-6 rounded-lg overflow-hidden shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3004.4462882536293!2d28.86809911535979!3d41.13821097928958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab76efcb2d99f%3A0x8ce71b8d7c1e8e62!2zxLBzbWV0cGHFn2EsIDUzLiBTay4gTk86OUEsIDM0MjcwIFN1bHRhbmdhemkvxLBzdGFuYnVs!5e0!3m2!1sen!2str!4v1685271552149!5m2!1sen!2str" 
                  width="100%" 
                  height="400" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Royal Restaurant Sultangazi - İsmetpaşa"
                ></iframe>
              </div>
            </div>
            
            {/* Reservation Form */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-secondary mb-6">{t('contact.booking.title')}</h3>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('contact.booking.name')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('contact.booking.phone')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('contact.booking.date')}</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('contact.booking.time')}</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="people"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.booking.people')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={
                                    language === 'ar' ? "اختر عدد الأشخاص" : "Select number of people"
                                  } />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">
                                  {language === 'ar' ? "1 شخص" : "1 person"}
                                </SelectItem>
                                <SelectItem value="2">
                                  {language === 'ar' ? "2 أشخاص" : "2 people"}
                                </SelectItem>
                                <SelectItem value="3">
                                  {language === 'ar' ? "3 أشخاص" : "3 people"}
                                </SelectItem>
                                <SelectItem value="4">
                                  {language === 'ar' ? "4 أشخاص" : "4 people"}
                                </SelectItem>
                                <SelectItem value="5">
                                  {language === 'ar' ? "5 أشخاص" : "5 people"}
                                </SelectItem>
                                <SelectItem value="6+">
                                  {language === 'ar' ? "6 أشخاص أو أكثر" : "6+ people"}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.booking.notes')}</FormLabel>
                            <FormControl>
                              <Textarea rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <i className="bi bi-hourglass-split animate-spin mr-2"></i>
                            {language === 'ar' ? "جاري التأكيد..." : "Confirming..."}
                          </>
                        ) : (
                          t('contact.booking.submit')
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
