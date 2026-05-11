'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.number().optional(),
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
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
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
    } catch (error) {
      console.error('Lead capture error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Get Your Results</CardTitle>
              <CardDescription>
                We'll email you the full report and next steps
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Check your email!</h3>
              <p className="text-sm text-slate-600">
                We've sent your audit report and will reach out soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email - Required */}
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Company Name - Optional */}
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Acme Inc"
                  {...register('companyName')}
                />
              </div>

              {/* Role - Optional */}
              <div>
                <Label htmlFor="role">Your Role</Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="Engineering Manager"
                  {...register('role')}
                />
              </div>

              {/* Team Size - Optional */}
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  placeholder="10"
                  {...register('teamSize', { valueAsNumber: true })}
                />
              </div>

              {/* Honeypot for spam protection */}
              <input
                type="text"
                name="website"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Me the Report'
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                We'll only email you about this audit and Credex updates. No spam.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}