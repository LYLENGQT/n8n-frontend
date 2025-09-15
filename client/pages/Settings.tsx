import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-4">User Profile</h2>
        <div className="grid gap-4 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="you@example.com" type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Reset Password</Label>
            <Input id="password" placeholder="New password" type="password" />
          </div>
          <div>
            <Button>Save</Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Preferences</h2>
        <div className="grid gap-2 max-w-xl">
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="size-4" /> Enable notifications
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="size-4" /> Optimize storage
          </label>
        </div>
      </section>

      <div className="pt-4 border-t">
        <Button variant="destructive">Logout</Button>
      </div>
    </div>
  );
}
