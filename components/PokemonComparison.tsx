'use client';

import { useState, useEffect } from 'react';
import { Pokemon, ImageType } from '@/lib/pokemon';
import PokemonImage from './PokemonImage';
import { saveComparisonToHistory } from './ComparisonHistory';

interface PokemonComparisonProps {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
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

function calculateTotalStats(stats: { name: string; value: number }[]): number {
  return stats.reduce((sum, stat) => sum + stat.value, 0);
}

function getTypeEffectiveness(attackingType: string, defendingTypes: string[]): number {
  // 簡易的なタイプ相性（完全版は実装が複雑なため簡略化）
  const superEffective: { [key: string]: string[] } = {
    fire: ['grass', 'bug', 'ice', 'steel'],
    water: ['fire', 'ground', 'rock'],
    electric: ['water', 'flying'],
    grass: ['water', 'ground', 'rock'],
    ice: ['grass', 'ground', 'flying', 'dragon'],
    fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
    poison: ['grass', 'fairy'],
    ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
    flying: ['grass', 'fighting', 'bug'],
    psychic: ['fighting', 'poison'],
    bug: ['grass', 'psychic', 'dark'],
    rock: ['fire', 'ice', 'flying', 'bug'],
    ghost: ['psychic', 'ghost'],
    dragon: ['dragon'],
    dark: ['psychic', 'ghost'],
    steel: ['ice', 'rock', 'fairy'],
    fairy: ['fighting', 'dragon', 'dark'],
  };

  const notVeryEffective: { [key: string]: string[] } = {
    fire: ['fire', 'water', 'rock', 'dragon'],
    water: ['water', 'grass', 'dragon'],
    electric: ['electric', 'grass', 'dragon'],
    grass: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
    ice: ['fire', 'water', 'ice', 'steel'],
    fighting: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
    poison: ['poison', 'ground', 'rock', 'ghost'],
    ground: ['grass', 'bug'],
    flying: ['electric', 'rock', 'steel'],
    psychic: ['psychic', 'steel'],
    bug: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
    rock: ['fighting', 'ground', 'steel'],
    ghost: ['dark'],
    dragon: ['steel'],
    dark: ['fighting', 'dark', 'fairy'],
    steel: ['fire', 'water', 'electric', 'steel'],
    fairy: ['fire', 'poison', 'steel'],
  };

  let effectiveness = 1;
  for (const defendingType of defendingTypes) {
    if (superEffective[attackingType]?.includes(defendingType)) {
      effectiveness *= 2;
    } else if (notVeryEffective[attackingType]?.includes(defendingType)) {
      effectiveness *= 0.5;
    }
  }

  return effectiveness;
}

function getStatName(statName: string): string {
  const names: { [key: string]: string } = {
    hp: 'HP',
    attack: '攻撃',
    defense: '防御',
    'special-attack': '特攻',
    'special-defense': '特防',
    speed: '素早さ',
  };
  return names[statName] || statName;
}

function PokemonImageSelector({
  pokemon,
  imageType,
  onImageTypeChange
}: {
  pokemon: Pokemon;
  imageType: ImageType;
  onImageTypeChange: (type: ImageType) => void;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex gap-1 flex-wrap justify-center">
        <button
          onClick={() => onImageTypeChange('front')}
          className={`p-1.5 rounded transition-colors ${
            imageType === 'front'
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
          title="前向き"
          aria-label="前向き"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {pokemon.imageBack && (
          <button
            onClick={() => onImageTypeChange('back')}
            className={`p-1.5 rounded transition-colors ${
              imageType === 'back'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            title="後ろ向き"
            aria-label="後ろ向き"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {pokemon.imageGifFront && (
          <button
            onClick={() => onImageTypeChange('gif-front')}
            className={`p-1.5 rounded transition-colors ${
              imageType === 'gif-front'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            title="GIF前向き"
            aria-label="GIF前向き"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {pokemon.imageGifBack && (
          <button
            onClick={() => onImageTypeChange('gif-back')}
            className={`p-1.5 rounded transition-colors ${
              imageType === 'gif-back'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            title="GIF後ろ向き"
            aria-label="GIF後ろ向き"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>
      <PokemonImage
        pokemon={pokemon}
        size={192}
        showSelector={false}
        imageType={imageType}
        onImageTypeChange={onImageTypeChange}
      />
    </div>
  );
}

export default function PokemonComparison({ pokemon1, pokemon2 }: PokemonComparisonProps) {
  const [imageType1, setImageType1] = useState<ImageType>('front');
  const [imageType2, setImageType2] = useState<ImageType>('front');
  const totalStats1 = calculateTotalStats(pokemon1.stats);
  const totalStats2 = calculateTotalStats(pokemon2.stats);
  const winner = totalStats1 > totalStats2 ? pokemon1 : totalStats1 < totalStats2 ? pokemon2 : null;

  // タイプ相性の計算
  const pokemon1Effectiveness = pokemon1.types.map(type =>
    getTypeEffectiveness(type, pokemon2.types)
  ).reduce((a, b) => a * b, 1);

  const pokemon2Effectiveness = pokemon2.types.map(type =>
    getTypeEffectiveness(type, pokemon1.types)
  ).reduce((a, b) => a * b, 1);

  // 比較履歴をlocalStorageに保存
  useEffect(() => {
    saveComparisonToHistory(
      pokemon1.name,
      pokemon1.nameJa,
      pokemon2.name,
      pokemon2.nameJa
    );
  }, [pokemon1.name, pokemon1.nameJa, pokemon2.name, pokemon2.nameJa]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* 勝敗判定 */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center">
          {winner ? (
            <div>
              <p className="text-white text-lg mb-2">総合能力値の勝者</p>
              <h2 className="text-3xl font-bold text-white">
                {winner.nameJa} ({totalStats1 > totalStats2 ? totalStats1 : totalStats2})
              </h2>
            </div>
          ) : (
            <h2 className="text-3xl font-bold text-white">引き分け</h2>
          )}
        </div>

        <div className="relative grid md:grid-cols-2 gap-8 p-8">
          {/* ポケモン1 */}
          <div className="text-center">
            <PokemonImageSelector
              pokemon={pokemon1}
              imageType={imageType1}
              onImageTypeChange={setImageType1}
            />
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {pokemon1.nameJa}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              #{String(pokemon1.id).padStart(3, '0')}
            </p>
            <div className="flex gap-2 justify-center mb-6">
              {pokemon1.typesJa.map((typeJa, index) => (
                <span
                  key={pokemon1.types[index]}
                  className={`${getTypeColor(pokemon1.types[index])} px-4 py-2 rounded-full text-sm font-semibold text-white`}
                >
                  {typeJa}
                </span>
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">総合能力値</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalStats1}</p>
            </div>
            <div className="space-y-2">
              {pokemon1.stats.map((stat) => {
                const pokemon2Stat = pokemon2.stats.find(s => s.name === stat.name);
                const isHigher = pokemon2Stat ? stat.value > pokemon2Stat.value : false;
                const isLower = pokemon2Stat ? stat.value < pokemon2Stat.value : false;
                return (
                  <div key={stat.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getStatName(stat.name)}
                      </span>
                      <span className={`text-sm font-semibold ${
                        isHigher ? 'text-green-600 dark:text-green-400' :
                        isLower ? 'text-red-600 dark:text-red-400' :
                        'text-gray-800 dark:text-white'
                      }`}>
                        {stat.value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isHigher ? 'bg-green-500' : isLower ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(stat.value / 255) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VS */}
          <div className="flex items-center justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <div className="bg-gradient-to-r from-red-500 to-blue-500 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">VS</span>
            </div>
          </div>

          {/* ポケモン2 */}
          <div className="text-center">
            <PokemonImageSelector
              pokemon={pokemon2}
              imageType={imageType2}
              onImageTypeChange={setImageType2}
            />
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {pokemon2.nameJa}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              #{String(pokemon2.id).padStart(3, '0')}
            </p>
            <div className="flex gap-2 justify-center mb-6">
              {pokemon2.typesJa.map((typeJa, index) => (
                <span
                  key={pokemon2.types[index]}
                  className={`${getTypeColor(pokemon2.types[index])} px-4 py-2 rounded-full text-sm font-semibold text-white`}
                >
                  {typeJa}
                </span>
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">総合能力値</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalStats2}</p>
            </div>
            <div className="space-y-2">
              {pokemon2.stats.map((stat) => {
                const pokemon1Stat = pokemon1.stats.find(s => s.name === stat.name);
                const isHigher = pokemon1Stat ? stat.value > pokemon1Stat.value : false;
                const isLower = pokemon1Stat ? stat.value < pokemon1Stat.value : false;
                return (
                  <div key={stat.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getStatName(stat.name)}
                      </span>
                      <span className={`text-sm font-semibold ${
                        isHigher ? 'text-green-600 dark:text-green-400' :
                        isLower ? 'text-red-600 dark:text-red-400' :
                        'text-gray-800 dark:text-white'
                      }`}>
                        {stat.value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isHigher ? 'bg-green-500' : isLower ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(stat.value / 255) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* タイプ相性 */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
            タイプ相性
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {pokemon1.nameJa} → {pokemon2.nameJa}
              </p>
              <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                pokemon1Effectiveness > 1 ? 'bg-green-500 text-white' :
                pokemon1Effectiveness < 1 ? 'bg-red-500 text-white' :
                'bg-gray-400 text-white'
              }`}>
                {pokemon1Effectiveness > 1 ? '効果抜群' :
                 pokemon1Effectiveness < 1 ? '効果いまひとつ' :
                 '効果普通'} ({pokemon1Effectiveness}x)
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {pokemon2.nameJa} → {pokemon1.nameJa}
              </p>
              <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                pokemon2Effectiveness > 1 ? 'bg-green-500 text-white' :
                pokemon2Effectiveness < 1 ? 'bg-red-500 text-white' :
                'bg-gray-400 text-white'
              }`}>
                {pokemon2Effectiveness > 1 ? '効果抜群' :
                 pokemon2Effectiveness < 1 ? '効果いまひとつ' :
                 '効果普通'} ({pokemon2Effectiveness}x)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
