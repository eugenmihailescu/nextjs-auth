'use client';

import LogoutButton from '@/components/auth/logout-button';
import { useCurrentUser } from '@/hooks/use-current-user';

const SettingsPage = () => {
  const user = useCurrentUser();

  return (
    <div className="rounded-xl bg-white p-10">
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <LogoutButton>Sign out</LogoutButton>
    </div>
  );
};

export default SettingsPage;
