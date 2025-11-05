'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Pokemon } from '@/lib/pokemon';

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
  const [isHovered, setIsHovered] = useState(false);
  const currentImage = isHovered && pokemon.imageGif ? pokemon.imageGif : pokemon.image;

  return (
    <Link href={`/pokemon/${pokemon.name}`}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={currentImage}
              alt={pokemon.nameJa}
              fill
              className="object-contain pixelated"
              sizes="128px"
            />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
            {pokemon.nameJa}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            #{String(pokemon.id).padStart(3, '0')}
          </p>
          <div className="flex gap-2">
            {pokemon.typesJa.map((typeJa, index) => (
              <span
                key={pokemon.types[index]}
                className={`${getTypeColor(pokemon.types[index])} px-3 py-1 rounded-full text-xs font-semibold text-white`}
              >
                {typeJa}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
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
