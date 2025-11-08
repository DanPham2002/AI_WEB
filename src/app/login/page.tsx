'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  login: z.string().min(1, { message: 'Vui lòng nhập email hoặc tên đăng nhập của bạn.' }),
  password: z.string().min(1, { message: 'Mật khẩu là bắt buộc.' }),
});

export default function LoginPage() {
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Mock login. We use the 'login' field as the identifier.
    login(values.login);
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Đăng nhập</CardTitle>
          <CardDescription>Nhập thông tin của bạn để truy cập tài khoản</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email hoặc Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com hoặc ten_dang_nhap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Chưa có tài khoản?{' '}
            <Link href="/signup" className="underline font-medium text-primary hover:text-primary/90">
              Đăng ký
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
