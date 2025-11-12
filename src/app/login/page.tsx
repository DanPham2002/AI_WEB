'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { collection, query, where, getDocs } from 'firebase/firestore';

const formSchema = z.object({
  credential: z.string().min(1, { message: 'Vui lòng nhập email hoặc tên đăng nhập.' }),
  password: z.string().min(1, { message: 'Mật khẩu là bắt buộc.' }),
});

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credential: '',
      password: '',
    },
  });

  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let email = values.credential;
    
    // Check if credential is a username (doesn't contain '@')
    if (!email.includes('@')) {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('username', '==', values.credential));
        
        getDocs(q).then(querySnapshot => {
            if (querySnapshot.empty) {
                toast({
                    variant: 'destructive',
                    title: 'Tên Đăng Nhập Không Tồn Tại',
                    description: 'Tên đăng nhập bạn nhập không tồn tại. Vui lòng kiểm tra lại.',
                });
                return;
            }

            // Get email from the found user document
            const userEmail = querySnapshot.docs[0].data().email;
            signIn(userEmail, values.password);

        }).catch(error => {
            const permissionError = new FirestorePermissionError({
              path: usersRef.path,
              operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    } else {
      signIn(email, values.password);
    }
  }

  async function signIn(email: string, password: string) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard');
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        let title = 'Lỗi Đăng Nhập';
        let description = 'Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.';

        if (error instanceof FirebaseError) {
          switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
              title = 'Thông Tin Không Hợp Lệ';
              description = 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.';
              break;
            case 'auth/invalid-email':
              title = 'Email Không Hợp Lệ';
              description = 'Địa chỉ email bạn nhập không hợp lệ.';
              break;
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
          <CardTitle className="text-2xl font-bold font-headline">Đăng nhập</CardTitle>
          <CardDescription>Nhập thông tin của bạn để truy cập tài khoản</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="credential"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email hoặc Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com hoặc username" {...field} />
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
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
