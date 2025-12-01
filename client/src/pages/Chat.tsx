import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/mockData";
import { Send, Bot, User, Sparkles, FileText, Quote, ChevronRight, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const { messages, addMessage, clearChat } = useStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage(input);
    setInput("");
    setIsThinking(true);

    setTimeout(() => setIsThinking(false), 2000);
  };

  const handleClearChat = () => {
    clearChat();
    toast({
      title: "Chat Cleared",
      description: "Conversation history has been reset."
    });
  };

  return (
    <div className="flex h-full flex-col relative overflow-hidden">
      {/* Header */}
      <header className="h-20 border-b border-border/40 flex items-center px-8 glass-panel sticky top-0 z-10 justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">AI Assistant</h1>
            <p className="text-xs text-muted-foreground mt-1">Powered by RAG Pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" title="Clear Chat">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear conversation?</AlertDialogTitle>
                <AlertDialogDescription>This will remove all messages from the current session.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearChat}>Clear</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-10 pb-10">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-in-fade-up">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">How can I help you?</h3>
                <p className="text-muted-foreground">Ask questions about your uploaded documents.</p>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-6 animate-in-fade-up",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md mt-1",
                  msg.role === "user"
                    ? "bg-gradient-to-br from-gray-800 to-black text-white dark:from-white dark:to-gray-200 dark:text-black"
                    : "bg-white dark:bg-white/10 text-primary border border-border/50"
                )}
              >
                {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>

              <div className={cn("flex flex-col gap-3 max-w-[85%]", msg.role === "user" && "items-end")}>
                {/* Message Bubble */}
                <div
                  className={cn(
                    "rounded-2xl px-6 py-4 text-sm leading-7 shadow-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm shadow-primary/20 shadow-lg"
                      : "glass-card rounded-tl-sm"
                  )}
                >
                  {msg.content}
                </div>

                {/* Citations */}
                {msg.citations && (
                  <div className="flex flex-wrap gap-2 pl-1">
                    {msg.citations.map((citation, idx) => (
                      <Sheet key={idx}>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-2 rounded-lg bg-white/50 dark:bg-white/5 border-primary/20 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all"
                          >
                            <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-primary">
                              <FileText className="h-3 w-3" />
                            </div>
                            <span className="truncate max-w-[120px] font-medium">{citation.docName}</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span>p.{citation.page}</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] border-l border-white/10 glass-panel">
                          <SheetHeader className="mb-8">
                            <div className="flex items-center gap-2 text-primary mb-2">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Quote className="h-5 w-5" />
                              </div>
                              <span className="text-xs font-bold uppercase tracking-wider">Source Reference</span>
                            </div>
                            <SheetTitle className="text-2xl font-display">{citation.docName}</SheetTitle>
                            <SheetDescription className="text-base">
                              Page {citation.page} • Relevance Score: 0.92
                            </SheetDescription>
                          </SheetHeader>
                          <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                            <div className="p-6 rounded-xl bg-muted/30 border border-border/50 text-base leading-8 font-medium relative overflow-hidden">
                              <Quote className="absolute top-4 right-4 h-12 w-12 text-foreground/5 -z-0" />
                              <span className="relative z-10">"{citation.text}"</span>
                            </div>
                          </div>
                          <div className="mt-8 flex gap-3">
                            <Button className="flex-1 shadow-lg shadow-primary/20">View Context</Button>
                            <Button variant="outline" className="flex-1">Open Original PDF</Button>
                          </div>
                        </SheetContent>
                      </Sheet>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-6 animate-in-fade-up">
              <div className="h-10 w-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-md border border-border/50">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2 h-12 px-6 glass-card rounded-2xl rounded-tl-sm">
                <span className="text-xs font-medium text-muted-foreground mr-2">Thinking</span>
                <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-4" />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 bg-gradient-to-t from-background to-transparent">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative flex items-center group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your knowledge base..."
              className="h-16 pl-8 pr-16 rounded-full glass-input border-2 border-white/20 shadow-xl text-base relative z-10 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isThinking}
              className="absolute right-3 h-12 w-12 rounded-full shadow-lg shadow-primary/20 z-20 transition-transform active:scale-95"
            >
              <Send className="h-5 w-5 ml-0.5" />
            </Button>
          </form>
          <div className="text-center mt-3">
            <p className="text-[10px] text-muted-foreground font-medium tracking-wide">AI-GENERATED CONTENT • CHECK CITATIONS FOR ACCURACY</p>
          </div>
        </div>
      </div>
    </div>
  );
}
