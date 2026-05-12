'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import type { Tool, UseCase } from '@/lib/types';

const STORAGE_KEY = 'ai-audit-form-data';

const toolOptions: { value: Tool; label: string }[] = [
  { value: 'cursor', label: 'Cursor' },
  { value: 'github-copilot', label: 'GitHub Copilot' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'openai-api', label: 'OpenAI API' },
  { value: 'anthropic-api', label: 'Anthropic API' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'windsurf', label: 'Windsurf' },
];

const plansByTool: Record<Tool, string[]> = {
  cursor: ['hobby', 'pro', 'business'],
  'github-copilot': ['individual', 'business', 'enterprise'],
  claude: ['free', 'pro', 'team'],
  chatgpt: ['free', 'plus', 'team'],
  'openai-api': ['payg'],
  'anthropic-api': ['payg'],
  gemini: ['free', 'advanced'],
  windsurf: ['free', 'pro'],
};

const formSchema = z.object({
  tools: z.array(
    z.object({
      tool: z.string(),
      plan: z.string(),
      monthlySpend: z.number().min(0),
      seats: z.number().min(1),
    })
  ).min(1, 'Add at least one tool'),
  teamSize: z.number().min(1),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
});

type FormData = z.infer<typeof formSchema>;

export default function AuditForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tools: [{ tool: 'cursor', plan: 'pro', monthlySpend: 0, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tools',
  });

  const formValues = watch();

  // Persist form state to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setValue('tools', parsed.tools);
        setValue('teamSize', parsed.teamSize);
        setValue('useCase', parsed.useCase);
      } catch (error) {
        console.error('Failed to load saved form data', error);
      }
    }
    }, [setValue]);

  // Debounced localStorage save to avoid excessive writes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formValues]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Run the audit
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      // Store result in sessionStorage for the results page
      sessionStorage.setItem('audit-result', JSON.stringify(result));
      
      // Navigate to results
      router.push('/results');
    } catch (error) {
      console.error('Audit failed:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI Spend Audit</CardTitle>
        <CardDescription>
          Tell us what you&apos;re paying for. We&apos;ll show you where you&apos;re overspending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tools Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">AI Tools You Pay For</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ tool: 'cursor', plan: 'pro', monthlySpend: 0, seats: 1 })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tool
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Tool Selection */}
                  <div>
                    <Label htmlFor={`tools.${index}.tool`}>Tool</Label>
                    <Select
                      value={watch(`tools.${index}.tool`)}
                      onValueChange={(value: string) => {
                        setValue(`tools.${index}.tool`, value as Tool);
                        setValue(`tools.${index}.plan`, plansByTool[value as Tool][0]);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {toolOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Plan Selection */}
                  <div>
                    <Label htmlFor={`tools.${index}.plan`}>Plan</Label>
                    <Select
                      value={watch(`tools.${index}.plan`)}
                      onValueChange={(value: string) => setValue(`tools.${index}.plan`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {plansByTool[watch(`tools.${index}.tool`) as Tool]?.map((plan) => (
                          <SelectItem key={plan} value={plan}>
                            {plan.charAt(0).toUpperCase() + plan.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Monthly Spend */}
                  <div>
                    <Label htmlFor={`tools.${index}.monthlySpend`}>Monthly $</Label>
                    <Input
                      type="number"
                      {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                      placeholder="120"
                    />
                  </div>

                  {/* Seats */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`tools.${index}.seats`}>Seats</Label>
                      <Input
                        type="number"
                        {...register(`tools.${index}.seats`, { valueAsNumber: true })}
                        placeholder="3"
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-6"
                        onClick={() => remove(index)}
                        aria-label={`Remove ${watch(`tools.${index}.tool`)} tool`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {errors.tools?.message && (
              <p className="text-sm text-red-500">{errors.tools.message}</p>
            )}
          </div>

          {/* Team & Use Case */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamSize">Total Team Size</Label>
              <Input
                type="number"
                {...register('teamSize', { valueAsNumber: true })}
                placeholder="5"
              />
              {errors.teamSize && (
                <p className="text-sm text-red-500">{errors.teamSize.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="useCase">Primary Use Case</Label>
              <Select
                value={watch('useCase')}
                onValueChange={(value: string) => setValue('useCase', value as UseCase)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="data">Data Analysis</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Audit...
              </>
            ) : (
              'Get My Free Audit'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}