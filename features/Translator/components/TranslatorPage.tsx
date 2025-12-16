'use client';

import { useEffect } from 'react';
import { ArrowLeftRight, WifiOff, Languages, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { cn } from '@/shared/lib/utils';
import { ActionButton } from '@/shared/components/ui/ActionButton';
import Sidebar from '@/shared/components/Menu/Sidebar';
import Banner from '@/shared/components/Menu/Banner';
import useTranslatorStore from '../store/useTranslatorStore';
import TranslatorInput from './TranslatorInput';
import TranslatorOutput from './TranslatorOutput';
import TranslationHistory from './TranslationHistory';
import SEOContent from './SEOContent';

interface TranslatorPageProps {
  locale?: string;
}

export default function TranslatorPage({ locale = 'en' }: TranslatorPageProps) {
  const {
    sourceText,
    sourceLanguage,
    targetLanguage,
    translatedText,
    romanization,
    isLoading,
    error,
    isOffline,
    history,
    setSourceText,
    setSourceLanguage,
    swapLanguages,
    translate,
    clearInput,
    loadHistory,
    deleteFromHistory,
    clearHistory,
    restoreFromHistory
  } = useTranslatorStore();

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleTranslate = () => {
    if (!isOffline && sourceText.trim().length > 0) {
      translate();
    }
  };

  return (
    <div className='min-h-[100dvh] max-w-[100dvw] lg:pr-20 flex gap-0'>
      <Sidebar />
      <div
        className={clsx(
          'flex flex-col gap-4',
          'w-full lg:w-4/5 px-4 md:px-8',
          'pb-20'
        )}
      >
        <Banner />
        <div className='flex flex-col gap-6 w-full max-w-6xl mx-auto'>
          {/* Header */}
          <div
            className={cn(
              'flex items-center gap-4 p-6 rounded-2xl',
              'bg-gradient-to-r from-[var(--card-color)] to-[var(--background-color)]',
              'border border-[var(--border-color)]'
            )}
          >
            <div
              className={cn(
                'p-3 rounded-xl',
                'bg-[var(--main-color)]/10',
                'border border-[var(--main-color)]/20'
              )}
            >
              <Languages className='h-8 w-8 text-[var(--main-color)]' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-[var(--main-color)]'>
                Japanese Translator
              </h1>
              <p className='text-sm text-[var(--secondary-color)] mt-1'>
                Translate between English and Japanese with romanization support
              </p>
            </div>
          </div>

          {/* Offline indicator */}
          {isOffline && (
            <div
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl',
                'bg-yellow-500/10 border border-yellow-500/30',
                'text-yellow-600 dark:text-yellow-400'
              )}
              role='alert'
            >
              <WifiOff className='h-5 w-5 flex-shrink-0' />
              <span className='text-sm font-medium'>
                You are offline. Translation is unavailable until you reconnect.
              </span>
            </div>
          )}

          {/* Main translation area */}
          <div
            className={cn(
              'grid gap-4',
              'grid-cols-1 lg:grid-cols-[1fr_auto_1fr]',
              'items-stretch'
            )}
          >
            {/* Input section */}
            <TranslatorInput
              value={sourceText}
              onChange={setSourceText}
              onTranslate={handleTranslate}
              sourceLanguage={sourceLanguage}
              onLanguageChange={setSourceLanguage}
              isLoading={isLoading}
              error={error}
              isOffline={isOffline}
            />

            {/* Swap button - centered between input and output */}
            <div className='flex items-center justify-center lg:pt-16'>
              <button
                onClick={swapLanguages}
                disabled={isLoading || isOffline}
                className={cn(
                  'h-14 w-14 rounded-full cursor-pointer',
                  'bg-[var(--card-color)] border-2 border-[var(--border-color)]',
                  'hover:border-[var(--main-color)] hover:bg-[var(--border-color)]',
                  'active:scale-95 transition-all duration-200',
                  'flex items-center justify-center',
                  'rotate-90 lg:rotate-0',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2'
                )}
                aria-label='Swap languages'
              >
                <ArrowLeftRight className='h-5 w-5 text-[var(--main-color)]' />
              </button>
            </div>

            {/* Output section */}
            <TranslatorOutput
              translation={translatedText}
              romanization={romanization}
              targetLanguage={targetLanguage}
              sourceLanguage={sourceLanguage}
              isLoading={isLoading}
            />
          </div>

          {/* Translate button */}
          <div className='flex justify-center'>
            <ActionButton
              onClick={handleTranslate}
              disabled={
                isLoading || isOffline || sourceText.trim().length === 0
              }
              colorScheme='main'
              borderRadius='2xl'
              borderBottomThickness={6}
              className={cn(
                'w-full md:w-auto min-w-[240px] h-14 text-lg font-semibold',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <Sparkles className='h-5 w-5' />
              {isLoading ? 'Translating...' : 'Translate'}
            </ActionButton>
          </div>

          {/* History section */}
          <div className='mt-6'>
            <TranslationHistory
              entries={history}
              onSelect={restoreFromHistory}
              onDelete={deleteFromHistory}
              onClearAll={clearHistory}
            />
          </div>

          {/* SEO Content */}
          <SEOContent locale={locale} />
        </div>
      </div>
    </div>
  );
}
