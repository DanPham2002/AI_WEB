'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Copy, Loader2, Sparkles, User, Bot, Send, Paperclip, X } from 'lucide-react';
import { handleGenerate } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: 'Nội dung không được để trống.',
  }),
  type: z.enum(['react_component', 'nestjs_endpoint']).default('react_component'),
  imageDataUri: z.string().optional(),
});

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  isCode?: boolean;
  imagePreview?: string;
}

const suggestionPrompts = [
  'Thẻ giá sản phẩm với ba gói',
  'Biểu mẫu liên hệ với tên, email và tin nhắn',
  'Phần hero với tiêu đề và nút kêu gọi hành động',
  'Thẻ hồ sơ người dùng với ảnh đại diện và chi tiết',
];

export function Generator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      type: 'react_component',
    },
  });

  const { setValue } = form;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.prompt && !file) {
      toast({
        variant: 'destructive',
        title: 'Yêu cầu không hợp lệ',
        description: 'Vui lòng nhập mô tả hoặc tải lên một hình ảnh.',
      });
      return;
    }
    
    setIsLoading(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: values.prompt,
      imagePreview: imagePreview || undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();
    removeFile();

    let fileDataUri: string | undefined = undefined;
    if (file) {
      fileDataUri = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const response = await handleGenerate({ ...values, imageDataUri: fileDataUri });
    
    if (response.error) {
      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        sender: 'ai',
        content: `Rất tiếc, đã có lỗi xảy ra: ${response.error}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: 'destructive',
        title: 'Tạo mã thất bại',
        description: response.error,
      });
    } else if (response.code) {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: response.code,
        isCode: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
    
    setIsLoading(false);
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    toast({
      description: 'Đã sao chép mã vào clipboard!',
    });
  }
  
  const handleSuggestionClick = (prompt: string) => {
    setValue('prompt', prompt);
  };


  return (
    <Card className="shadow-lg h-[80vh] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold font-headline">
          <Sparkles className="h-6 w-6 text-primary" />
          Trợ Lý Mã AI
        </CardTitle>
        <CardDescription>
          Trò chuyện với AI để tạo mã nguồn cho component hoặc endpoint. Tải ảnh lên để có kết quả trực quan hơn.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
           <div className="flex h-full items-center justify-center">
             <div className="text-center text-muted-foreground">
                <Bot size={48} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Bắt đầu cuộc trò chuyện</h3>
                <p>Hãy mô tả component bạn muốn tạo, tải lên một ảnh, hoặc chọn một gợi ý bên dưới.</p>
             </div>
           </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
            {message.sender === 'ai' && (
              <Avatar className="h-9 w-9">
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
            )}
            <div className={`rounded-lg p-3 max-w-2xl ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
              {message.imagePreview && (
                 <div className="mb-2">
                    <Image src={message.imagePreview} alt="Image preview" width={200} height={200} className="rounded-md" />
                 </div>
              )}
              {message.isCode ? (
                <div className="relative">
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(message.content)} className="absolute top-2 right-2 h-7 w-7">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Sao chép mã</span>
                  </Button>
                  <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 overflow-x-auto text-sm">
                    <code className="text-white font-code">{message.content}</code>
                  </pre>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
            {message.sender === 'user' && (
              <Avatar className="h-9 w-9">
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <Avatar className="h-9 w-9">
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
            <div className="rounded-lg p-3 bg-secondary flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">AI đang viết mã...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="p-4 border-t bg-background">
        <div className="mb-2 flex flex-wrap gap-2">
          {suggestionPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(prompt)}
              className="text-xs"
            >
              {prompt}
            </Button>
          ))}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-3">
            {imagePreview && (
                <div className="relative">
                    <Image src={imagePreview} alt="Preview" width={60} height={60} className="rounded-md object-cover"/>
                    <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground" onClick={removeFile}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="Ví dụ: Thẻ giá sản phẩm với ba gói..."
                      className="resize-none"
                      rows={1}
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Đính kèm ảnh</span>
            </Button>
            <Button type="submit" disabled={isLoading} size="icon">
              <Send className="h-5 w-5" />
              <span className="sr-only">Gửi</span>
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
}
