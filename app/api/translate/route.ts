import { NextRequest, NextResponse } from 'next/server';

interface TranslationRequestBody {
  text: string;
  sourceLanguage: 'en' | 'ja';
  targetLanguage: 'en' | 'ja';
}

interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

/**
 * Error codes for translation API
 */
const ERROR_CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  RATE_LIMIT: 'RATE_LIMIT',
  API_ERROR: 'API_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const;

/**
 * POST /api/translate
 * Translates text between English and Japanese using Google Cloud Translation API
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TranslationRequestBody;
    const { text, sourceLanguage, targetLanguage } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        {
          code: ERROR_CODES.INVALID_INPUT,
          message: 'Please enter valid text to translate.',
          status: 400
        },
        { status: 400 }
      );
    }

    if (text.trim().length === 0) {
      return NextResponse.json(
        {
          code: ERROR_CODES.INVALID_INPUT,
          message: 'Please enter text to translate.',
          status: 400
        },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        {
          code: ERROR_CODES.INVALID_INPUT,
          message: 'Text exceeds maximum length of 5000 characters.',
          status: 400
        },
        { status: 400 }
      );
    }

    // Validate languages
    const validLanguages = ['en', 'ja'];
    if (
      !validLanguages.includes(sourceLanguage) ||
      !validLanguages.includes(targetLanguage)
    ) {
      return NextResponse.json(
        {
          code: ERROR_CODES.INVALID_INPUT,
          message: 'Invalid language selection.',
          status: 400
        },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_TRANSLATE_API_KEY is not configured');
      return NextResponse.json(
        {
          code: ERROR_CODES.AUTH_ERROR,
          message: 'Translation service configuration error.',
          status: 500
        },
        { status: 500 }
      );
    }

    // Call Google Cloud Translation API
    const googleApiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const googleResponse = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text'
      })
    });

    // Handle rate limiting
    if (googleResponse.status === 429) {
      return NextResponse.json(
        {
          code: ERROR_CODES.RATE_LIMIT,
          message: 'Too many requests. Please wait a moment and try again.',
          status: 429
        },
        { status: 429 }
      );
    }

    // Handle auth errors
    if (googleResponse.status === 401 || googleResponse.status === 403) {
      console.error('Google API authentication error:', googleResponse.status);
      return NextResponse.json(
        {
          code: ERROR_CODES.AUTH_ERROR,
          message: 'Translation service configuration error.',
          status: googleResponse.status
        },
        { status: googleResponse.status }
      );
    }

    // Handle other errors
    if (!googleResponse.ok) {
      console.error('Google API error:', googleResponse.status);
      return NextResponse.json(
        {
          code: ERROR_CODES.API_ERROR,
          message: 'Translation service is temporarily unavailable.',
          status: googleResponse.status
        },
        { status: googleResponse.status }
      );
    }

    const data = (await googleResponse.json()) as GoogleTranslateResponse;
    const translation = data.data.translations[0];

    return NextResponse.json({
      translatedText: translation.translatedText,
      detectedSourceLanguage: translation.detectedSourceLanguage
    });
  } catch (error) {
    console.error('Translation API error:', error);

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        {
          code: ERROR_CODES.NETWORK_ERROR,
          message: 'Unable to connect. Please check your internet connection.',
          status: 503
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        code: ERROR_CODES.API_ERROR,
        message: 'Translation service is temporarily unavailable.',
        status: 500
      },
      { status: 500 }
    );
  }
}
