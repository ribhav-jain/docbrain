import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Database,
  CreditCard,
  Globe,
  Shield,
  Save,
  LogOut,
  Check,
  Zap,
  Star,
  Rocket,
  ArrowRight,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/mockData";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const { toast } = useToast();
  const { user, updateUser, clearAllData } = useStore();
  const { isDark, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Sync with store if user changes
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      updateUser(fullName, email);
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Your changes have been successfully updated.",
      });
    }, 1000);
  };

  const handleClearData = () => {
    clearAllData();
    toast({
      title: "Database Cleared",
      description: "All documents and indexes have been removed.",
      variant: "destructive"
    });
  };

  return (
    <div className="h-full flex flex-col p-8 gap-8 overflow-y-auto animate-in-fade-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and system configurations.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap justify-start w-full max-w-fit">
          <TabsTrigger value="general" className="gap-2"><User className="h-4 w-4" /> General</TabsTrigger>
          <TabsTrigger value="model" className="gap-2"><Database className="h-4 w-4" /> Model & RAG</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield className="h-4 w-4" /> Security</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2"><CreditCard className="h-4 w-4" /> Billing</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <img
                  src="/ribhav.jpg"
                  alt="User avatar"
                  className="h-20 w-20 rounded-full border-2 border-border object-cover"
                />
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/20 px-6 py-4">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your interface experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
                </div>
                <Switch
                  checked={isDark}
                  onCheckedChange={toggleTheme}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about your document processing.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Model & RAG Settings */}
        <TabsContent value="model" className="space-y-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>RAG Configuration</CardTitle>
              <CardDescription>Fine-tune how your AI retrieves and answers questions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>LLM Provider</Label>
                  <Select defaultValue="gpt4">
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt4">GPT-4o (OpenAI)</SelectItem>
                      <SelectItem value="claude3">Claude 3.5 Sonnet (Anthropic)</SelectItem>
                      <SelectItem value="llama3">Llama 3 70B (Groq)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">The model used to generate final answers.</p>
                </div>

                <div className="grid gap-2">
                  <Label>Embedding Model</Label>
                  <Select defaultValue="openai-small">
                    <SelectTrigger>
                      <SelectValue placeholder="Select embedding model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai-small">text-embedding-3-small</SelectItem>
                      <SelectItem value="openai-large">text-embedding-3-large</SelectItem>
                      <SelectItem value="cohere">Cohere Multilingual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Chunk Size</Label>
                  <Select defaultValue="512">
                    <SelectTrigger>
                      <SelectValue placeholder="Select chunk size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="256">256 Tokens (Granular)</SelectItem>
                      <SelectItem value="512">512 Tokens (Balanced)</SelectItem>
                      <SelectItem value="1024">1024 Tokens (Context Rich)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Smaller chunks give more precise citations; larger chunks provide more context.</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">Hybrid Search</Label>
                    <p className="text-sm text-muted-foreground">Combine vector search with keyword search (BM25) for better accuracy.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/20 px-6 py-4">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Updating Configuration..." : "Update Configuration"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your knowledge base.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="space-y-1">
                  <h4 className="font-medium text-destructive">Clear Vector Database</h4>
                  <p className="text-sm text-muted-foreground">Permanently delete all embedded documents and indexes.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Clear All Data</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account data and remove all documents.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearData} className="bg-destructive hover:bg-destructive/90">Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage API keys and access control.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <Lock className="h-12 w-12 text-muted-foreground/50" />
                <div className="space-y-2">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">Add an extra layer of security to your account using an authenticator app.</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6 max-w-5xl">
          {/* Current Plan */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the {user?.plan || 'Free'} plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Plan Name</p>
                  <p className="text-lg font-bold">{user?.plan || 'Free'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Billing Cycle</p>
                  <p className="text-lg font-bold">Monthly</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Next Billing Date</p>
                  <p className="text-lg font-bold">January 15, 2025</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-primary/20 bg-primary/5">
              <Button variant="outline" size="sm">Manage Subscription</Button>
            </CardFooter>
          </Card>

          {/* Pricing Plans */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Upgrade Your Plan</h3>
              <p className="text-muted-foreground">Choose the perfect plan for your needs. Always flexible - upgrade, downgrade, or cancel anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Free',
                  price: '$0',
                  icon: Zap,
                  isCurrent: user?.plan === 'Free',
                  features: ['5 documents', '100 queries/month', 'Basic RAG', '1 GB storage', 'Community support'],
                  cta: 'Free Plan',
                  color: 'from-blue-500/10 to-blue-500/5',
                },
                {
                  name: 'Pro',
                  price: '$29',
                  icon: Star,
                  isCurrent: user?.plan === 'Pro',
                  features: ['100 documents', '10,000 queries/month', 'Advanced RAG', '50 GB storage', 'Email support', 'Advanced analytics', 'API access'],
                  cta: 'Upgrade',
                  color: 'from-purple-500/10 to-purple-500/5',
                  badge: 'Popular',
                },
                {
                  name: 'Enterprise',
                  price: 'Custom',
                  icon: Rocket,
                  isCurrent: user?.plan === 'Enterprise',
                  features: ['Unlimited docs', 'Unlimited queries', 'Custom pipelines', '24/7 support', 'Unlimited storage', 'Team tools'],
                  cta: 'Contact Sales',
                  color: 'from-pink-500/10 to-pink-500/5',
                },
              ].map((plan) => {
                const Icon = plan.icon;
                return (
                  <Card key={plan.name} className={cn(
                    "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
                    plan.isCurrent ? "border-primary/50 bg-primary/5" : "hover:border-primary/30"
                  )}>
                    {plan.badge && (
                      <div className="absolute top-14 right-3">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-xs font-bold text-black">
                          <Zap className="h-3 w-3" />
                          {plan.badge}
                        </div>
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            {plan.name}
                          </CardTitle>
                          <CardDescription>
                            <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                            {plan.name !== 'Enterprise' && <span>/month</span>}
                          </CardDescription>
                        </div>
                        {plan.isCurrent && (
                          <div className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-600 text-xs font-semibold">
                            Current
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={plan.isCurrent ? "outline" : "default"}
                        disabled={plan.isCurrent}
                      >
                        {plan.cta}
                        {!plan.isCurrent && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and manage your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: 'December 15, 2024', amount: '$29.00', status: 'Paid', invoice: '#INV-2024-012' },
                  { date: 'November 15, 2024', amount: '$29.00', status: 'Paid', invoice: '#INV-2024-011' },
                  { date: 'October 15, 2024', amount: '$0.00', status: 'N/A', invoice: 'Free Plan' },
                ].map((transaction, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{transaction.date}</p>
                      <p className="text-xs text-muted-foreground">{transaction.invoice}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-sm">{transaction.amount}</p>
                      <p className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full w-fit ml-auto',
                        transaction.status === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-700'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/20">
              <Button variant="outline" size="sm">Download All Invoices</Button>
            </CardFooter>
          </Card>

          {/* Usage Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Overview</CardTitle>
              <CardDescription>Your current usage for this billing cycle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Documents</p>
                  <p className="text-sm text-muted-foreground">5 / 5 (Free plan limit)</p>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2 w-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Queries This Month</p>
                  <p className="text-sm text-muted-foreground">78 / 100</p>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-blue-500 rounded-full h-2" style={{ width: '78%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Storage Used</p>
                  <p className="text-sm text-muted-foreground">0.8 / 1 GB</p>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-purple-500 rounded-full h-2" style={{ width: '80%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your billing payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-blue-500/20 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Visa ending in 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/26</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Update</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/20">
              <Button variant="outline" size="sm">Add Payment Method</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
