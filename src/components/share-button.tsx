'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  auditId: string;
  savings: number;
}

export function ShareButton({ auditId, savings }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/audit/${auditId}`
    : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I could save $${savings.toFixed(0)}/month on AI tools!`,
          text: 'Check out my AI spend audit results',
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback to copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button onClick={handleShare} variant="outline" size="sm">
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 mr-2" />
          Share Results
        </>
      )}
    </Button>
  );
}