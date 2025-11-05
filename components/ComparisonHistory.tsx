'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ComparisonHistoryItem {
  name1: string;
  nameJa1: string;
  name2: string;
  nameJa2: string;
  timestamp: number;
}

const STORAGE_KEY = 'pokemon-comparison-history';
const MAX_HISTORY = 10; // 最大10件まで保存

export function saveComparisonToHistory(name1: string, nameJa1: string, name2: string, nameJa2: string) {
  if (typeof window === 'undefined') return;

  try {
    const history: ComparisonHistoryItem[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );

    // 既存の履歴をチェック（同じ組み合わせを重複させない）
    const existingIndex = history.findIndex(
      item => (item.name1 === name1 && item.name2 === name2) ||
              (item.name1 === name2 && item.name2 === name1)
    );

    const newItem: ComparisonHistoryItem = {
      name1,
      nameJa1,
      name2,
      nameJa2,
      timestamp: Date.now(),
    };

    if (existingIndex >= 0) {
      // 既存の履歴を削除して新しいものに置き換え
      history.splice(existingIndex, 1);
    }

    // 新しい履歴を先頭に追加
    history.unshift(newItem);

    // 最大件数を超えた場合は古いものを削除
    if (history.length > MAX_HISTORY) {
      history.splice(MAX_HISTORY);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save comparison history:', error);
  }
}

export default function ComparisonHistory() {
  const [history, setHistory] = useState<ComparisonHistoryItem[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedHistory: ComparisonHistoryItem[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      setHistory(savedHistory);
    } catch (error) {
      console.error('Failed to load comparison history:', error);
    }
  }, []);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'たった今';
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          過去の比較履歴
        </h3>
        <div className="space-y-3">
          {history.map((item, index) => (
            <Link
              key={`${item.name1}-${item.name2}-${item.timestamp}`}
              href={`/compare/${item.name1}/${item.name2}`}
              className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {index + 1}.
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {item.nameJa1}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">VS</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {item.nameJa2}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(item.timestamp)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
