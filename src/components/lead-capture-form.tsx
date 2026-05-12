'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.string().optional(),
  website: z.string().optional(), // Honeypot field for bot detection
});

type FormData = z.infer<typeof formSchema>;

interface LeadCaptureFormProps {
  auditId: string;
  savings: number;
  onClose: () => void;
}

export function LeadCaptureForm({ auditId, savings, onClose }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formSchema.parse({}),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // For now, just simulate success without calling the API
      // TODO: Re-enable once Supabase + Resend are configured

      console.log('Lead captured (simulated):', {
        ...data,
        auditId,
        savings,
        teamSize: data.teamSize ? parseInt(data.teamSize, 10) : undefined,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        reset();
      }, 2000);

      /* ORIGINAL CODE - Re-enable later:
      const response = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          auditId,
          savings,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        alert('Failed to submit. Please try again.');
      }
      */
    } catch (error) {
      console.error('Lead capture error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Mail className="w-10 h-10 text-green-500 mb-3" />
          <CardTitle className="text-green-700">Thank You!</CardTitle>
          <CardDescription className="text-center">
            We'll be in touch shortly with your personalized quote.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Get My Personalized Quote
        </CardTitle>
        <CardDescription>
          Share your details and we'll reach out with a tailored plan to
          optimize your AI spend.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Your company"
              {...register('companyName')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                type="text"
                placeholder="e.g. Engineering Manager"
                {...register('role')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                type="number"
                placeholder="e.g. 10"
                {...register('teamSize')}
              />
              {errors.teamSize && (
                <p className="text-sm text-red-500">{errors.teamSize.message}</p>
              )}
            </div>
          </div>

          {/* Honeypot field - hidden from humans, filled by bots */}
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="text"
              {...register('website')}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <Button
            type="submit"
            className={cn('w-full', isSubmitting && 'opacity-75')}
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}