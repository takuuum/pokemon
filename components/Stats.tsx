'use client';

interface StatsProps {
  pokemonCount: number;
  typeCount?: number;
}

export default function Stats({ pokemonCount, typeCount = 18 }: StatsProps) {
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        統計
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">総ポケモン数</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{pokemonCount}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">タイプ数</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{typeCount}</p>
        </div>
      </div>
    </div>
  );
}
