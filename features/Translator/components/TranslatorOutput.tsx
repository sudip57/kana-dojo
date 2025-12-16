'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, Loader2, FileText } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Language } from '../types';

interface TranslatorOutputProps {
  translation: string;
  romanization?: string | null;
  targetLanguage: Language;
  isLoading: boolean;
  sourceLanguage: Language;
}

export default function TranslatorOutput({
  translation,
  romanization,
  targetLanguage,
  isLoading,
  sourceLanguage
}: TranslatorOutputProps) {
  const [copied, setCopied] = useState(false);

  // Show romanization when source is Japanese (translating from Japanese)
  const showRomanization = sourceLanguage === 'ja' && romanization;

  const handleCopy = useCallback(async () => {
    if (!translation) return;

    try {
      await navigator.clipboard.writeText(translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [translation]);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 w-full p-5 rounded-2xl',
        'bg-[var(--card-color)] border border-[var(--border-color)]',
        'shadow-lg shadow-black/5'
      )}
    >
      {/* Header with language label */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-[var(--secondary-color)] uppercase tracking-wider'>
            To
          </span>
          <span
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium',
              'bg-[var(--background-color)] border border-[var(--border-color)]',
              'text-[var(--main-color)]'
            )}
          >
            {targetLanguage === 'en' ? '🇺🇸 English' : '🇯🇵 日本語'}
          </span>
        </div>

        {/* Copy button */}
        {translation && !isLoading && (
          <button
            onClick={handleCopy}
            className={cn(
              'h-9 w-9 rounded-lg cursor-pointer',
              'flex items-center justify-center',
              'bg-[var(--background-color)] border border-[var(--border-color)]',
              'hover:border-[var(--main-color)] transition-all duration-200',
              copied
                ? 'text-green-500 border-green-500'
                : 'text-[var(--secondary-color)] hover:text-[var(--main-color)]'
            )}
            aria-label={copied ? 'Copied!' : 'Copy translation'}
          >
            {copied ? (
              <Check className='h-4 w-4' />
            ) : (
              <Copy className='h-4 w-4' />
            )}
          </button>
        )}
      </div>

      {/* Output area */}
      <div
        className={cn(
          'w-full min-h-[220px] p-4 rounded-xl',
          'bg-[var(--background-color)] border border-[var(--border-color)]',
          'text-[var(--main-color)]',
          'relative'
        )}
      >
        {isLoading ? (
          <div className='flex flex-col items-center justify-center h-full min-h-[188px] gap-3'>
            <div
              className={cn(
                'p-4 rounded-full',
                'bg-[var(--main-color)]/10',
                'animate-pulse'
              )}
            >
              <Loader2 className='h-8 w-8 animate-spin text-[var(--main-color)]' />
            </div>
            <span className='text-sm text-[var(--secondary-color)]'>
              Translating...
            </span>
          </div>
        ) : translation ? (
          <div className='flex flex-col gap-4'>
            {/* Main translation */}
            <p className='text-lg whitespace-pre-wrap break-words leading-relaxed'>
              {translation}
            </p>

            {/* Romanization (when translating from Japanese) */}
            {showRomanization && (
              <div
                className={cn(
                  'pt-4 mt-2 border-t border-[var(--border-color)]',
                  'bg-[var(--main-color)]/5 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl'
                )}
              >
                <div className='flex items-center gap-2 mb-2'>
                  <FileText className='h-3.5 w-3.5 text-[var(--secondary-color)]' />
                  <span className='text-xs font-medium text-[var(--secondary-color)] uppercase tracking-wider'>
                    Romanization (Romaji)
                  </span>
                </div>
                <p className='text-sm text-[var(--secondary-color)] whitespace-pre-wrap break-words leading-relaxed'>
                  {romanization}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full min-h-[188px] gap-3'>
            <div
              className={cn(
                'p-4 rounded-full',
                'bg-[var(--secondary-color)]/10'
              )}
            >
              <FileText className='h-8 w-8 text-[var(--secondary-color)]/50' />
            </div>
            <p className='text-[var(--secondary-color)]/60 text-sm text-center'>
              {targetLanguage === 'en'
                ? 'Translation will appear here...'
                : '翻訳がここに表示されます...'}
            </p>
          </div>
        )}
      </div>

      {/* Copy confirmation message */}
      {copied && (
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg',
            'bg-green-500/10 border border-green-500/30',
            'text-green-500 text-sm font-medium'
          )}
          role='status'
        >
          <Check className='h-4 w-4' />
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
