'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Pokemon, ImageType, getGenderInfo } from '@/lib/pokemon';

interface PokemonGridProps {
  pokemonList: Pokemon[];
  searchQuery: string;
  selectedType: string | null;
}

function getTypeColor(type: string): string {
  const colors: { [key: string]: string } = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };
  return colors[type] || 'bg-gray-400';
}

function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const [imageType, setImageType] = useState<ImageType>('front');
  const [isHovered, setIsHovered] = useState(false);
  const genderInfo = getGenderInfo(pokemon.genderRate);

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
  // ホバー時にGIFアニメーションに切り替える（既存の挙動を維持）
  const displayImage = isHovered && pokemon.imageGifFront ? pokemon.imageGifFront : currentImage;

  return (
    <div className="relative">
      <Link href={`/pokemon/${pokemon.name}`} className="block">
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-blue-400 active:scale-95 active:shadow-md active:border-2 active:border-blue-500 relative group border-2 border-transparent"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* クリック可能を示すアイコン（スマホでは常に表示、デスクトップではホバー時のみ） */}
          <div className="absolute top-2 right-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src={displayImage}
                alt={pokemon.nameJa}
                fill
                className="object-contain pixelated transition-transform duration-300 group-hover:scale-110"
                sizes="128px"
              />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {pokemon.nameJa}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              #{String(pokemon.id).padStart(3, '0')}
            </p>
            <div className="flex gap-2 mb-2">
              {pokemon.typesJa.map((typeJa, index) => (
                <span
                  key={pokemon.types[index]}
                  className={`${getTypeColor(pokemon.types[index])} px-3 py-1 rounded-full text-xs font-semibold text-white`}
                >
                  {typeJa}
                </span>
              ))}
            </div>
            {/* 性別表示 */}
            <div className="flex gap-1 justify-center">
              {genderInfo.isGenderless ? (
                <span className="text-xs text-gray-500 dark:text-gray-400" title="性別なし">
                  ⚲
                </span>
              ) : (
                <>
                  {genderInfo.hasMale && (
                    <span className="text-xs text-blue-500" title="オス">
                      ♂
                    </span>
                  )}
                  {genderInfo.hasFemale && (
                    <span className="text-xs text-pink-500" title="メス">
                      ♀
                    </span>
                  )}
                </>
              )}
            </div>

            {/* ホバー時に表示される「詳細を見る」テキスト（スマホでは常に表示） */}
            <div className="my-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                詳細を見る
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function PokemonGrid({ pokemonList, searchQuery, selectedType }: PokemonGridProps) {
  const filteredPokemon = pokemonList.filter((pokemon) => {
    // タイプフィルタ
    if (selectedType) {
      if (!pokemon.types.includes(selectedType)) {
        return false;
      }
    }

    // 検索クエリ
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase().trim();
    const idMatch = String(pokemon.id).includes(query) || String(pokemon.id).padStart(3, '0').includes(query);
    const nameJaMatch = pokemon.nameJa.toLowerCase().includes(query);
    const nameMatch = pokemon.name.toLowerCase().includes(query);

    return idMatch || nameJaMatch || nameMatch;
  });

  if (filteredPokemon.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
          検索結果が見つかりませんでした
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          「{searchQuery}」に一致するポケモンはありません
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        {filteredPokemon.length}匹のポケモンが見つかりました
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredPokemon.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </>
  );
}
