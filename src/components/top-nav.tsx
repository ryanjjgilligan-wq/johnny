"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, PawPrint, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchPill } from "@/components/search-pill";

export function TopNav() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <PawPrint className="h-7 w-7 text-primary" fill="#FF5A5F" />
          <span className="font-bold text-xl tracking-tight">barkyard</span>
        </Link>

        <div className="hidden md:flex flex-1 justify-center">
          <SearchPill />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/host"
            className="hidden md:inline-flex text-sm font-medium px-4 py-2 rounded-full hover:bg-secondary"
          >
            Become a host
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border px-3 py-1.5 hover:shadow-sm transition-shadow">
                <Menu className="h-4 w-4" />
                <Avatar className="h-7 w-7">
                  {user?.image ? (
                    <AvatarImage src={user.image} alt={user.name ?? ""} />
                  ) : null}
                  <AvatarFallback>
                    {user?.name?.[0]?.toUpperCase() ?? <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/bookings">Trips</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Host dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/host">Become a host</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
                    Log out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/signin">
                      <span className="font-semibold">Sign in</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signin">Sign up</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/host">Become a host</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/search">Find a yard</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="md:hidden border-t px-4 py-3">
        <Link
          href="/search"
          className="flex items-center gap-3 rounded-full border px-4 py-3 shadow-sm"
        >
          <Search className="h-4 w-4" />
          <div className="text-sm">
            <div className="font-semibold">Where to?</div>
            <div className="text-xs text-muted-foreground">Anywhere · Any time · Add dogs</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
