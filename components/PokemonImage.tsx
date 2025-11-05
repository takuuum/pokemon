'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pokemon, ImageType } from '@/lib/pokemon';

interface PokemonImageProps {
  pokemon: Pokemon;
  size?: number;
  className?: string;
  showSelector?: boolean;
  imageType?: ImageType;
  onImageTypeChange?: (type: ImageType) => void;
}

export default function PokemonImage({
  pokemon,
  size = 256,
  className = '',
  showSelector = false,
  imageType: externalImageType,
  onImageTypeChange: externalOnImageTypeChange
}: PokemonImageProps) {
  const [internalImageType, setInternalImageType] = useState<ImageType>('front');
  const imageType = externalImageType ?? internalImageType;
  const setImageType = externalOnImageTypeChange ?? setInternalImageType;

  const getImageUrl = (type: ImageType): string | null => {
    switch (type) {
      case 'front':
        return pokemon.imageFront || pokemon.image || null;
      case 'front-female':
        return pokemon.imageFrontFemale || null;
      case 'back':
        return pokemon.imageBack || null;
      case 'back-female':
        return pokemon.imageBackFemale || null;
      case 'gif-front':
        return pokemon.imageGifFront || pokemon.imageGif || null;
      case 'gif-front-female':
        return pokemon.imageGifFrontFemale || null;
      case 'gif-back':
        return pokemon.imageGifBack || null;
      case 'gif-back-female':
        return pokemon.imageGifBackFemale || null;
      default:
        return pokemon.image || null;
    }
  };

  const currentImage = getImageUrl(imageType) || pokemon.image;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {showSelector && (
        <div className="mb-4 flex gap-2 flex-wrap justify-center">
          <button
            onClick={() => setImageType('front')}
            className={`p-2 rounded-lg transition-colors ${
              imageType === 'front'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            title="前向き（オス/デフォルト）"
            aria-label="前向き（オス/デフォルト）"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {pokemon.imageFrontFemale && (
            <button
              onClick={() => setImageType('front-female')}
              className={`p-2 rounded-lg transition-colors relative ${
                imageType === 'front-female'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              title="前向き（メス）"
              aria-label="前向き（メス）"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="absolute bottom-0 right-0 text-[8px] leading-none">♀</span>
            </button>
          )}
          {pokemon.imageBack && (
            <button
              onClick={() => setImageType('back')}
              className={`p-2 rounded-lg transition-colors ${
                imageType === 'back'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              title="後ろ向き（オス/デフォルト）"
              aria-label="後ろ向き（オス/デフォルト）"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {pokemon.imageBackFemale && (
            <button
              onClick={() => setImageType('back-female')}
              className={`p-2 rounded-lg transition-colors relative ${
                imageType === 'back-female'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              title="後ろ向き（メス）"
              aria-label="後ろ向き（メス）"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="absolute bottom-0 right-0 text-[8px] leading-none">♀</span>
            </button>
          )}
          {pokemon.imageGifFront && (
            <button
              onClick={() => setImageType('gif-front')}
              className={`p-2 rounded-lg transition-colors ${
                imageType === 'gif-front'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              title="GIF前向き（オス/デフォルト）"
              aria-label="GIF前向き（オス/デフォルト）"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          {pokemon.imageGifFrontFemale && (
            <button
              onClick={() => setImageType('gif-front-female')}
              className={`p-2 rounded-lg transition-colors relative ${
                imageType === 'gif-front-female'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              title="GIF前向き（メス）"
              aria-label="GIF前向き（メス）"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="absolute bottom-0 right-0 text-[8px] leading-none">♀</span>
            </button>
          )}
          {pokemon.imageGifBack && (
            <button
              onClick={() => setImageType('gif-back')}
              className={`p-2 rounded-lg transition-colors ${
                imageType === 'gif-back'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              title="GIF後ろ向き（オス/デフォルト）"
              aria-label="GIF後ろ向き（オス/デフォルト）"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {pokemon.imageGifBackFemale && (
            <button
              onClick={() => setImageType('gif-back-female')}
              className={`p-2 rounded-lg transition-colors relative ${
                imageType === 'gif-back-female'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              title="GIF後ろ向き（メス）"
              aria-label="GIF後ろ向き（メス）"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="absolute bottom-0 right-0 text-[8px] leading-none">♀</span>
            </button>
          )}
        </div>
      )}
      <div
        className="relative"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Image
          src={currentImage}
          alt={pokemon.nameJa}
          fill
          className="object-contain pixelated"
          sizes={`${size}px`}
        />
      </div>
    </div>
  );
}
