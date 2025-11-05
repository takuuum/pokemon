'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PokemonListItemWithJa } from '@/lib/pokemon';
import PokemonComparison from './PokemonComparison';

interface PokemonCompareClientProps {
  pokemonList: PokemonListItemWithJa[];
}

export default function PokemonCompareClient({ pokemonList }: PokemonCompareClientProps) {
  const router = useRouter();
  const [pokemon1, setPokemon1] = useState<string>('');
  const [pokemon2, setPokemon2] = useState<string>('');

  const handleCompare = () => {
    if (pokemon1 && pokemon2) {
      router.push(`/compare/${pokemon1}/${pokemon2}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          ポケモンを選択
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ポケモン1
            </label>
            <select
              value={pokemon1}
              onChange={(e) => setPokemon1(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            >
              <option value="">選択してください</option>
              {pokemonList.map((pokemon) => (
                <option key={pokemon.name} value={pokemon.name}>
                  {pokemon.nameJa} (#{String(pokemon.id).padStart(3, '0')})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ポケモン2
            </label>
            <select
              value={pokemon2}
              onChange={(e) => setPokemon2(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            >
              <option value="">選択してください</option>
              {pokemonList.map((pokemon) => (
                <option key={pokemon.name} value={pokemon.name}>
                  {pokemon.nameJa} (#{String(pokemon.id).padStart(3, '0')})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleCompare}
          disabled={!pokemon1 || !pokemon2}
          className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          比較する
        </button>
      </div>
    </div>
  );
}
