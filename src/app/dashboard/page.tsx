'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Generator } from './generator';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cuboid, Film, Wand2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const newFeatures = [
  {
    icon: <Cuboid className="h-8 w-8 text-primary" />,
    title: 'Tạo Mô Hình 3D',
    description: 'Mô tả một vật thể 3D và để AI tạo ra mô hình cho bạn, sẵn sàng để sử dụng trong các cảnh 3D của bạn.',
    image: PlaceHolderImages.find(img => img.id === 'feature-3d-model'),
    comingSoon: true,
  },
  {
    icon: <Film className="h-8 w-8 text-primary" />,
    title: 'Tạo Video Hoạt Hình',
    description: 'Biến câu chuyện của bạn thành video hoạt hình. Mô tả cảnh, nhân vật và hành động để biến tầm nhìn của bạn thành hiện thực.',
    image: PlaceHolderImages.find(img => img.id === 'feature-animation'),
    comingSoon: true,
  },
  {
    icon: <Wand2 className="h-8 w-8 text-primary" />,
    title: 'Tinh Chỉnh UI/UX Nâng Cao',
    description: 'Vượt xa việc tạo mã nguồn. Hãy để AI phân tích giao diện người dùng của bạn và đề xuất các cải tiến để có trải nghiệm người dùng tốt hơn.',
    image: PlaceHolderImages.find(img => img.id === 'feature-ux-tuning'),
    comingSoon: true,
  },
];


export default function DashboardPage() {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container max-w-7xl py-8">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Bảng điều khiển</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại, {user.email}! Tại đây bạn có thể sử dụng trình tạo mã được hỗ trợ bởi AI.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
           <Generator />
        </div>
        
        <div className="lg:col-span-3 mt-12">
            <h2 className="text-2xl font-bold tracking-tight font-headline mb-4 text-center">Khám Phá Các Tính Năng Sắp Ra Mắt</h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Chúng tôi đang không ngừng phát triển để mang đến cho bạn những công cụ AI mạnh mẽ hơn. Hãy xem qua những gì sắp có!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newFeatures.map((feature) => (
                <Card key={feature.title} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  {feature.image && (
                     <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <Image
                            src={feature.image.imageUrl}
                            alt={feature.image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={feature.image.imageHint}
                        />
                     </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {feature.icon}
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
