import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bot, BrainCircuit, Zap, ShieldCheck, Settings, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'Phân Tích Thông Minh',
    description: 'Tự động hóa việc phân tích dữ liệu phức tạp, cung cấp thông tin chi tiết và dự báo chính xác để ra quyết định tốt hơn.',
    image: PlaceHolderImages.find(img => img.id === 'feature-analysis'),
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Tối Ưu Hóa Quy Trình',
    description: 'Xác định và loại bỏ các điểm nghẽn trong quy trình làm việc của bạn, giúp tăng hiệu suất và giảm chi phí vận hành.',
    image: PlaceHolderImages.find(img => img.id === 'feature-optimize'),
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'Trợ Lý AI Tận Tâm',
    description: 'Tương tác với trợ lý AI của chúng tôi để tự động hóa các tác vụ lặp đi lặp lại và nhận hỗ trợ thông minh theo thời gian thực.',
    image: PlaceHolderImages.find(img => img.id === 'feature-assistant'),
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Bảo Mật Vượt Trội',
    description: 'Dữ liệu của bạn được bảo vệ với các tiêu chuẩn bảo mật hàng đầu, đảm bảo an toàn và tuân thủ tuyệt đối.',
    image: PlaceHolderImages.find(img => img.id === 'feature-security'),
  },
  {
    icon: <Settings className="h-8 w-8 text-primary" />,
    title: 'Tùy Chỉnh Linh Hoạt',
    description: 'Dễ dàng cấu hình và tùy chỉnh các mô hình AI để phù hợp với quy trình và mục tiêu kinh doanh cụ thể của bạn.',
    image: PlaceHolderImages.find(img => img.id === 'feature-customization'),
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: 'Báo Cáo Trực Quan',
    description: 'Tự động tạo báo cáo và biểu đồ chi tiết, giúp bạn dễ dàng theo dõi hiệu suất và đưa ra quyết định dựa trên dữ liệu.',
    image: PlaceHolderImages.find(img => img.id === 'feature-reporting'),
  },
];

const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32">
          <div className="container space-y-10 xl:space-y-16 px-4 md:px-6">
            <div className="grid gap-4 md:grid-cols-2 md:gap-16 items-center">
              <div className="space-y-4 text-center md:text-left">
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] font-headline">
                  Lifetex AI: Tương Lai Của Tự Động Hóa
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Trải nghiệm sức mạnh của trí tuệ nhân tạo để tối ưu hóa quy trình làm việc, tăng năng suất và thúc đẩy sự đổi mới.
                </p>
                <div className="space-x-4 flex justify-center md:justify-start">
                  <Button asChild size="lg">
                    <Link href="/signup">
                      Bắt Đầu Miễn Phí <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                 {heroImage && (
                   <Image
                     src={heroImage.imageUrl}
                     alt={heroImage.description}
                     fill
                     className="object-cover"
                     data-ai-hint={heroImage.imageHint}
                   />
                 )}
               </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Tính Năng Vượt Trội</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Nền Tảng AI Toàn Diện Cho Doanh Nghiệp</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Lifetex AI cung cấp một bộ công cụ mạnh mẽ được thiết kế để giải quyết những thách thức lớn nhất trong hoạt động kinh doanh của bạn.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
