import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app/generate", { replace: true });
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr] bg-background text-foreground">
      <header className="py-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl font-bold text-foreground">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">SA</div>
          <span>SaaS Auto-Flow</span>
        </div>
      </header>
      <main className="flex items-start justify-center px-4">
        <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
          <h1 className="text-center text-2xl font-semibold mb-6">Login</h1>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-muted-foreground">
                <Lock className="size-4" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background"
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <a href="#" className="hover:underline">Forgot password?</a>
            <a href="#" className="hover:underline">Create account</a>
          </div>
        </div>
      </main>
    </div>
  );
}
