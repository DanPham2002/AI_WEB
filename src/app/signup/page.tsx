'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

const formSchema = z
  .object({
    username: z.string().min(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự.' }).regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ có thể chứa chữ cái, số và dấu gạch dưới.'),
    email: z.string().email({ message: 'Vui lòng nhập một địa chỉ email hợp lệ.' }),
    password: z.string().min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ['confirmPassword'],
  });

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Save user info to Firestore
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        id: user.uid,
        username: values.username,
        email: values.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      let title = 'Lỗi Đăng Ký';
      let description = 'Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.';

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
            title = 'Email Đã Tồn Tại';
            description = 'Địa chỉ email này đã được sử dụng cho một tài khoản khác.';
        } else if (error.code === 'auth/invalid-email') {
            title = 'Email Không Hợp Lệ';
            description = 'Địa chỉ email bạn nhập không hợp lệ.';
        } else if (error.code === 'auth/weak-password') {
            title = 'Mật Khẩu Yếu';
            description = 'Mật khẩu phải có ít nhất 6 ký tự.';
        }
      }
      
      toast({
        variant: 'destructive',
        title: title,
        description: description,
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Tạo tài khoản</CardTitle>
          <CardDescription>Nhập thông tin của bạn để bắt đầu hành trình</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Đã có tài khoản?{' '}
            <Link href="/login" className="underline font-medium text-primary hover:text-primary/90">
              Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
