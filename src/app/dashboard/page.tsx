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
    title: 'Generate 3D Models',
    description: 'Describe a 3D object and let the AI generate a model for you, ready to be used in your 3D scenes.',
    image: PlaceHolderImages.find(img => img.id === 'feature-3d-model'),
    comingSoon: true,
  },
  {
    icon: <Film className="h-8 w-8 text-primary" />,
    title: 'Create Animated Videos',
    description: 'Turn your stories into animated videos. Describe the scene, characters, and actions to bring your vision to life.',
    image: PlaceHolderImages.find(img => img.id === 'feature-animation'),
    comingSoon: true,
  },
  {
    icon: <Wand2 className="h-8 w-8 text-primary" />,
    title: 'Advanced UI/UX Tuning',
    description: 'Go beyond code generation. Let the AI analyze your UI and suggest improvements for a better user experience.',
    image: PlaceHolderImages.find(img => img.id === 'feature-ux-tuning'),
    comingSoon: true,
  },
];


export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Using a timeout to allow auth state to be read from context
    // This prevents a flash of the dashboard for unauthenticated users
    const timer = setTimeout(() => {
      if (isAuthenticated === false) {
        router.push('/login');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isAuthenticated === null || isAuthenticated === false) {
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
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.identifier}! Here you can use the AI-powered code generator.
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
