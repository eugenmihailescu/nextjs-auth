import React from 'react';

import { auth, signOut } from '@/auth';

const SettingsPage = async () => {
  const session = await auth();

  return (
    <div className="flex flex-col items-center">
      <div className="m-1">
        <pre style={{ wordBreak: 'break-all', textWrap: 'pretty' }}>
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
      <form
        action={async () => {
          'use server';

          await signOut();
        }}
      >
        <button type="submit" className="m-2 rounded-md bg-sky-500 p-2">
          Sign Out
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
