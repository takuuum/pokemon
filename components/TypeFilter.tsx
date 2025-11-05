'use client';

const pokemonTypes = [
  { name: 'normal', nameJa: 'ノーマル', color: 'bg-gray-400' },
  { name: 'fire', nameJa: 'ほのお', color: 'bg-red-500' },
  { name: 'water', nameJa: 'みず', color: 'bg-blue-500' },
  { name: 'electric', nameJa: 'でんき', color: 'bg-yellow-400' },
  { name: 'grass', nameJa: 'くさ', color: 'bg-green-500' },
  { name: 'ice', nameJa: 'こおり', color: 'bg-cyan-300' },
  { name: 'fighting', nameJa: 'かくとう', color: 'bg-red-700' },
  { name: 'poison', nameJa: 'どく', color: 'bg-purple-500' },
  { name: 'ground', nameJa: 'じめん', color: 'bg-yellow-600' },
  { name: 'flying', nameJa: 'ひこう', color: 'bg-indigo-400' },
  { name: 'psychic', nameJa: 'エスパー', color: 'bg-pink-500' },
  { name: 'bug', nameJa: 'むし', color: 'bg-green-400' },
  { name: 'rock', nameJa: 'いわ', color: 'bg-yellow-800' },
  { name: 'ghost', nameJa: 'ゴースト', color: 'bg-purple-700' },
  { name: 'dragon', nameJa: 'ドラゴン', color: 'bg-indigo-700' },
  { name: 'dark', nameJa: 'あく', color: 'bg-gray-800' },
  { name: 'steel', nameJa: 'はがね', color: 'bg-gray-500' },
  { name: 'fairy', nameJa: 'フェアリー', color: 'bg-pink-300' },
];

interface TypeFilterProps {
  onTypeFilter: (type: string | null) => void;
  selectedType: string | null;
}

export default function TypeFilter({ onTypeFilter, selectedType }: TypeFilterProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => onTypeFilter(null)}
          className={`
            px-4 py-2 rounded-lg transition-colors font-medium
            ${
              selectedType === null
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }
          `}
        >
          すべて
        </button>
        {pokemonTypes.map((type) => (
          <button
            key={type.name}
            onClick={() => onTypeFilter(type.name)}
            className={`
              px-4 py-2 rounded-lg transition-colors font-medium flex items-center
              ${
                selectedType === type.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }
            `}
          >
            <span
              className={`w-3 h-3 rounded-full mr-2 ${type.color}`}
            />
            {type.nameJa}
          </button>
        ))}
      </div>
    </div>
  );
}
