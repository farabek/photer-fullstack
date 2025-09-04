import { ReactElement } from 'react';

// src/app/messenger/page.tsx
export default function MessengerPage(): ReactElement {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-light-100 mb-4 text-2xl font-bold">Messenger</h1>
      <p className="text-gray-400">Messenger page is under development.</p>
      <div className="mt-6">
        <div className="rounded-lg border border-gray-600 bg-gray-800 p-4">
          <p className="text-light-100">📱 Coming soon:</p>
          <ul className="mt-2 text-gray-400">
            <li>• Real-time messaging</li>
            <li>• Group chats</li>
            <li>• File sharing</li>
            <li>• Message history</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
