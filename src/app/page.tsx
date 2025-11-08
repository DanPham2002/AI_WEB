import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CodeXml, Server, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <CodeXml className="h-8 w-8 text-primary" />,
    title: 'React UI',
    description: 'A modern UI built with Next.js and React, featuring reusable components from shadcn/ui and a responsive layout.',
    image: PlaceHolderImages.find(img => img.id === 'feature-react'),
  },
  {
    icon: <Server className="h-8 w-8 text-primary" />,
    title: 'NestJS API Ready',
    description: 'A solid foundation for a RESTful API with NestJS, ready for you to build out your backend logic and endpoints.',
    image: PlaceHolderImages.find(img => img.id === 'feature-nestjs'),
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'User Authentication',
    description: 'Pre-configured UI and hooks for user sign-up, login, and protected routes, ready to connect to your auth middleware.',
    image: PlaceHolderImages.find(img => img.id === 'feature-auth'),
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'Basic Template Generation',
    description: 'Leverage GenAI to rapidly scaffold new React components and NestJS endpoints directly from a text prompt.',
    image: PlaceHolderImages.find(img => img.id === 'feature-ai'),
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
              <div className="space-y-4">
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] font-headline">
                  WebStarter: Your Next.js & NestJS Launchpad
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  A simple, powerful starter kit to kickstart your next full-stack application. Comes with React, NestJS structure, authentication, and AI-powered code generation.
                </p>
                <div className="space-x-4">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
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
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Core Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Build Faster</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Focus on your product, not the boilerplate. WebStarter provides the essential building blocks for modern web applications.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-2">
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
