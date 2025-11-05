import { getPokemon } from '@/lib/pokemon';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SidebarSimple from '@/components/SidebarSimple';
import PokemonImage from '@/components/PokemonImage';

interface PageProps {
  params: Promise<{
    name: string;
  }>;
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

export default async function PokemonDetail({ params }: PageProps) {
  const { name } = await params;
  let pokemon;
  try {
    pokemon = await getPokemon(name);
  } catch (error) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SidebarSimple />
      <div className="md:ml-64">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
          >
            ◀ 一覧に戻る
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 p-8 flex items-center justify-center">
                <PokemonImage pokemon={pokemon} size={256} showSelector={true} />
              </div>

              <div className="md:w-1/2 p-8">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    #{String(pokemon.id).padStart(3, '0')}
                  </p>
                  <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                    {pokemon.nameJa}
                  </h1>
                  <div className="flex gap-2 flex-wrap">
                    {pokemon.typesJa.map((typeJa, index) => (
                      <span
                        key={pokemon.types[index]}
                        className={`${getTypeColor(pokemon.types[index])} px-4 py-2 rounded-full text-sm font-semibold text-white`}
                      >
                        {typeJa}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      基本情報
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">高さ</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {pokemon.height}m
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">重さ</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {pokemon.weight}kg
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      特性
                    </h2>
                    <div className="flex gap-2 flex-wrap">
                      {pokemon.abilitiesJa.map((abilityJa, index) => (
                        <span
                          key={pokemon.abilities[index]}
                          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-800 dark:text-white"
                        >
                          {abilityJa}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      ステータス
                    </h2>
                    <div className="space-y-2">
                      {pokemon.stats.map((stat) => (
                        <div key={stat.name}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {stat.name === 'hp' ? 'HP' : stat.name === 'attack' ? '攻撃' : stat.name === 'defense' ? '防御' : stat.name === 'special-attack' ? '特攻' : stat.name === 'special-defense' ? '特防' : '素早さ'}
                            </span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">
                              {stat.value}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${(stat.value / 255) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
