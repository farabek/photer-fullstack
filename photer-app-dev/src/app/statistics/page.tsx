import { ReactElement } from 'react';

// src/app/statistics/page.tsx
export default function StatisticsPage(): ReactElement {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-light-100 mb-4 text-2xl font-bold">Statistics</h1>
      <p className="text-gray-400">Statistics page is under development.</p>
      <div className="mt-6">
        <div className="rounded-lg border border-gray-600 bg-gray-800 p-4">
          <p className="text-light-100">📊 Coming soon:</p>
          <ul className="mt-2 text-gray-400">
            <li>• Post analytics</li>
            <li>• Engagement metrics</li>
            <li>• Follower insights</li>
            <li>• Growth statistics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
