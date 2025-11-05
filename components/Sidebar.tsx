'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  pokemonCount: number;
  onTypeFilter: (type: string | null) => void;
  selectedType: string | null;
}

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

export default function Sidebar({ pokemonCount, onTypeFilter, selectedType }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* モバイル用メニューボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg md:hidden"
        aria-label="メニューを開く"
      >
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* オーバーレイ（モバイル） */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバー */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          overflow-y-auto
        `}
      >
        <div className="p-6">
          {/* ロゴ・タイトル */}
          <div className="mb-8 pt-12 md:pt-6">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                ポケモン図鑑
              </h2>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pokemonCount}匹のポケモン
            </p>
          </div>

          {/* ナビゲーション */}
          <nav className="mb-8">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`
                    block px-4 py-2 rounded-lg transition-colors
                    ${
                      pathname === '/'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    ホーム
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  onClick={() => setIsOpen(false)}
                  className={`
                    block px-4 py-2 rounded-lg transition-colors
                    ${
                      pathname?.startsWith('/compare')
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    比較
                  </div>
                </Link>
              </li>
            </ul>
          </nav>

          {/* タイプフィルタ */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              タイプで絞り込み
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onTypeFilter(null);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2 rounded-lg transition-colors
                  ${
                    selectedType === null
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                すべて
              </button>
              {pokemonTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => {
                    onTypeFilter(type.name);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center
                    ${
                      selectedType === type.name
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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

          {/* 統計情報 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              統計
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>総ポケモン数</span>
                <span className="font-semibold">{pokemonCount}</span>
              </div>
              <div className="flex justify-between">
                <span>タイプ数</span>
                <span className="font-semibold">{pokemonTypes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
