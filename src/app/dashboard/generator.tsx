'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Copy, Loader2, Sparkles, Terminal } from 'lucide-react';
import { handleGenerate } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters long.',
  }),
  type: z.enum(['react_component', 'nestjs_endpoint'], {
    required_error: 'You need to select a generation type.',
  }),
});

export function Generator() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      type: 'react_component',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedCode('');
    const response = await handleGenerate(values);
    setIsLoading(false);

    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: response.error,
      });
    } else if (response.code) {
      setGeneratedCode(response.code);
      toast({
        title: 'Success!',
        description: 'Your code has been generated.',
      });
    }
  }

  function handleCopy() {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    toast({
      description: 'Code copied to clipboard!',
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold font-headline">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Code Generator
          </CardTitle>
          <CardDescription>
            Describe the component or endpoint you want to create.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Generation Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="react_component" />
                          </FormControl>
                          <FormLabel className="font-normal">React Component</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="nestjs_endpoint" />
                          </FormControl>
                          <FormLabel className="font-normal">NestJS Endpoint</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A pricing card component with three tiers: Free, Pro, and Enterprise."
                        className="resize-none"
                        rows={7}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Code
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="lg:sticky lg:top-24">
        {isLoading && (
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border bg-card p-8">
              <div className="flex items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Generating code...</p>
              </div>
          </div>
        )}

        {!isLoading && generatedCode && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold font-headline">Generated Code</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy code</span>
              </Button>
            </CardHeader>
            <CardContent>
              <Alert className="bg-secondary">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Output</AlertTitle>
                  <AlertDescription>
                      <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 overflow-x-auto text-sm">
                          <code className="text-white font-code">{generatedCode}</code>
                      </pre>
                  </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {!isLoading && !generatedCode && (
           <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed bg-card p-8">
             <div className="text-center">
                <Image src="https://picsum.photos/seed/generator/400/300" alt="Code Generation Placeholder" width={400} height={300} className="mx-auto mb-4 rounded-lg" data-ai-hint="abstract code" />
                <h3 className="mt-4 text-lg font-semibold text-muted-foreground">Your generated code will appear here</h3>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
