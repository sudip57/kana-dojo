'use client';

import { useState } from 'react';
import { Trash2, Clock, X, History, ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ActionButton } from '@/shared/components/ui/ActionButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/components/ui/alert-dialog';
import type { TranslationEntry } from '../types';

interface TranslationHistoryProps {
  entries: TranslationEntry[];
  onSelect: (entry: TranslationEntry) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

/**
 * Format timestamp to a readable date/time string
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

/**
 * Truncate text to a maximum length
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export default function TranslationHistory({
  entries,
  onSelect,
  onDelete,
  onClearAll
}: TranslationHistoryProps) {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  if (entries.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 rounded-2xl',
          'bg-[var(--card-color)] border border-[var(--border-color)]',
          'text-[var(--secondary-color)]'
        )}
      >
        <div
          className={cn(
            'p-4 rounded-full mb-4',
            'bg-[var(--secondary-color)]/10'
          )}
        >
          <History className='h-10 w-10 opacity-50' />
        </div>
        <p className='text-base font-medium'>No translation history yet</p>
        <p className='text-sm mt-1 opacity-70'>
          Your translations will appear here
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-5 rounded-2xl',
        'bg-[var(--card-color)] border border-[var(--border-color)]',
        'shadow-lg shadow-black/5'
      )}
    >
      {/* Header with clear all button */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              'p-2 rounded-lg',
              'bg-[var(--main-color)]/10',
              'border border-[var(--main-color)]/20'
            )}
          >
            <History className='h-5 w-5 text-[var(--main-color)]' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-[var(--main-color)]'>
              Translation History
            </h3>
            <p className='text-xs text-[var(--secondary-color)]'>
              {entries.length} translation{entries.length !== 1 ? 's' : ''}{' '}
              saved
            </p>
          </div>
        </div>
        <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
          <AlertDialogTrigger asChild>
            <button
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer',
                'text-sm font-medium',
                'text-[var(--secondary-color)] hover:text-red-500',
                'bg-[var(--background-color)] border border-[var(--border-color)]',
                'hover:border-red-500/50 hover:bg-red-500/10',
                'transition-all duration-200'
              )}
            >
              <Trash2 className='h-4 w-4' />
              Clear All
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent
            className={cn(
              'bg-[var(--background-color)] border-[var(--border-color)]',
              'rounded-2xl'
            )}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className='text-[var(--main-color)]'>
                Clear Translation History?
              </AlertDialogTitle>
              <AlertDialogDescription className='text-[var(--secondary-color)]'>
                This will permanently delete all your translation history. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='gap-2'>
              <AlertDialogCancel
                className={cn(
                  'bg-[var(--card-color)] text-[var(--main-color)] border-[var(--border-color)]',
                  'hover:bg-[var(--border-color)] cursor-pointer'
                )}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onClearAll();
                  setClearDialogOpen(false);
                }}
                className='bg-red-500 text-white hover:bg-red-600 cursor-pointer'
              >
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* History entries list */}
      <div className='flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1'>
        {entries.map(entry => (
          <div
            key={entry.id}
            className={cn(
              'group flex items-start gap-3 p-4 rounded-xl cursor-pointer',
              'bg-[var(--background-color)] border border-[var(--border-color)]',
              'hover:border-[var(--main-color)] hover:shadow-md',
              'transition-all duration-200'
            )}
            onClick={() => onSelect(entry)}
            role='button'
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(entry);
              }
            }}
          >
            {/* Entry content */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-2'>
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-md font-medium',
                    'bg-[var(--main-color)]/10 text-[var(--main-color)]',
                    'border border-[var(--main-color)]/20'
                  )}
                >
                  {entry.sourceLanguage === 'en' ? '🇺🇸 EN' : '🇯🇵 JA'}
                  <ArrowRight className='h-3 w-3 inline mx-1' />
                  {entry.targetLanguage === 'en' ? '🇺🇸 EN' : '🇯🇵 JA'}
                </span>
                <span className='text-xs text-[var(--secondary-color)] flex items-center gap-1'>
                  <Clock className='h-3 w-3' />
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <p className='text-sm text-[var(--main-color)] font-medium truncate'>
                {truncateText(entry.sourceText, 60)}
              </p>
              <p className='text-xs text-[var(--secondary-color)] truncate mt-1 flex items-center gap-1'>
                <ArrowRight className='h-3 w-3 flex-shrink-0' />
                {truncateText(entry.translatedText, 60)}
              </p>
            </div>

            {/* Delete button */}
            <button
              className={cn(
                'h-8 w-8 rounded-lg cursor-pointer',
                'flex items-center justify-center flex-shrink-0',
                'opacity-0 group-hover:opacity-100',
                'bg-[var(--card-color)] border border-[var(--border-color)]',
                'text-[var(--secondary-color)] hover:text-red-500',
                'hover:border-red-500/50 hover:bg-red-500/10',
                'transition-all duration-200'
              )}
              onClick={e => {
                e.stopPropagation();
                onDelete(entry.id);
              }}
              aria-label='Delete entry'
            >
              <X className='h-4 w-4' />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
