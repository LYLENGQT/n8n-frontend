import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { clearHistory } from "@/lib/history";
import { clearLibrary } from "@/lib/library";
import { toast } from "@/components/ui/use-toast";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [statusUrl, setStatusUrl] = useState("");
  const [statusKey, setStatusKey] = useState("");

  useEffect(() => {
    try {
      const v = localStorage.getItem("webhookUrlOverride") || "";
      setWebhookUrl(v);
      const sUrl = localStorage.getItem("statusApiUrl") || "";
      setStatusUrl(sUrl);
      const sKey = localStorage.getItem("statusApiKey") || "";
      setStatusKey(sKey);
    } catch {}
  }, []);

  const saveWebhook = () => {
    try {
      if (webhookUrl.trim()) {
        localStorage.setItem("webhookUrlOverride", webhookUrl.trim());
        toast({ title: "Saved", description: "Webhook URL override updated." });
      } else {
        localStorage.removeItem("webhookUrlOverride");
        toast({ title: "Removed", description: "Using default webhook URL." });
      }
    } catch {
      toast({ title: "Error", description: "Could not save webhook URL." });
    }
  };

  const saveStatus = () => {
    try {
      if (statusUrl.trim()) localStorage.setItem("statusApiUrl", statusUrl.trim());
      else localStorage.removeItem("statusApiUrl");
      if (statusKey.trim()) localStorage.setItem("statusApiKey", statusKey.trim());
      else localStorage.removeItem("statusApiKey");
      toast({ title: "Saved", description: "Status API settings updated." });
    } catch {
      toast({ title: "Error", description: "Could not save status settings." });
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-4 tracking-tight">Appearance</h2>
        <div className="grid gap-4 max-w-xl rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4">
          <div className="grid gap-2">
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              className="h-9 rounded-md border bg-background px-3 text-sm"
              value={theme as string}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 tracking-tight">Generation</h2>
        <div className="grid gap-4 max-w-xl rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4">
          <div className="grid gap-2">
            <Label htmlFor="webhook">Webhook URL Override</Label>
            <Input
              id="webhook"
              placeholder="https://example.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Leave blank to use default URL from environment.</p>
            <div>
              <Button onClick={saveWebhook}>Save</Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status-url">Status API URL (optional)</Label>
            <Input
              id="status-url"
              placeholder="https://example.com/status/{jobId}"
              value={statusUrl}
              onChange={(e) => setStatusUrl(e.target.value)}
            />
            <Label htmlFor="status-key">Status API Key (optional)</Label>
            <Input
              id="status-key"
              placeholder="sk_..."
              value={statusKey}
              onChange={(e) => setStatusKey(e.target.value)}
            />
            <div>
              <Button onClick={saveStatus}>Save Status Settings</Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 tracking-tight">Data</h2>
        <div className="grid gap-3 max-w-xl rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                clearHistory();
                toast({ title: "Cleared", description: "History cleared." });
              }}
            >
              Clear History
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clearLibrary();
                toast({ title: "Cleared", description: "Library cleared." });
              }}
            >
              Clear Library
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 tracking-tight">About</h2>
        <div className="grid gap-2 max-w-xl rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4 text-sm text-muted-foreground">
          <div>Virtual Photoshoot • Modern UI</div>
          <div>No account required. Your data is stored locally in your browser.</div>
        </div>
      </section>
    </div>
  );
}
