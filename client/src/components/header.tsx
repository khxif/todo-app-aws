'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth-store';
import { signOut } from 'aws-amplify/auth';
import { LogOutIcon } from 'lucide-react';

export function Header() {
  const user = useAuthStore(state => state.user);

  const logout = async () => {
    await signOut({ global: true });
  };

  return (
    <header className="px-5 py-4 flex items-center justify-end border-b border-primary">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-10">
            <AvatarImage src={user?.picture} alt={user?.name} />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem
            onClick={logout}
            className="flex font-medium items-center justify-between w-full"
          >
            <p>Logout</p>
            <LogOutIcon />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
