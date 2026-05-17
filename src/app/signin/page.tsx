"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="container py-16" />}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      name,
      callbackUrl,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Could not sign in. Try again.");
      return;
    }
    router.push(res?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <div className="container py-16 max-w-md">
      <div className="text-center mb-8">
        <PawPrint className="mx-auto h-10 w-10 text-primary" fill="#FF5A5F" />
        <h1 className="mt-3 text-2xl font-bold">Welcome to Barkyard</h1>
        <p className="text-sm text-muted-foreground">Sign in or create an account in seconds.</p>
      </div>

      <form
        onSubmit={submit}
        className="rounded-2xl border bg-white p-6 shadow-card space-y-4"
      >
        <div className="space-y-1">
          <Label htmlFor="name">Display name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        {error && <div className="text-sm text-destructive">{error}</div>}
        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Continue"}
        </Button>

        {process.env.NEXT_PUBLIC_HAS_GOOGLE === "1" && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-muted-foreground">OR</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl })}
            >
              Continue with Google
            </Button>
          </>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Demo mode: any email works. We use it to identify your bookings.
        </p>
      </form>
    </div>
  );
}
