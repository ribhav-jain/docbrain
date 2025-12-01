import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useStore, DocStatus } from "@/lib/mockData";
import { FileText, UploadCloud, CheckCircle2, Loader2, Clock, X, FileType, Sparkles, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

const StatusIcon = ({ status }: { status: DocStatus }) => {
  switch (status) {
    case "ready":
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case "processing":
    case "uploading":
      return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function KnowledgeBase() {
  const { documents, addDocument, deleteDocument } = useStore();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => addDocument(file));
    toast({
      title: "File uploaded",
      description: "Processing started for " + acceptedFiles.length + " file(s)",
    });
  }, [addDocument, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const handleDelete = (id: string) => {
    deleteDocument(id);
    toast({
      title: "Document deleted",
      description: "The file has been removed from the knowledge base.",
    });
  };

  return (
    <div className="h-full flex flex-col p-6 md:p-10 gap-10 overflow-y-auto">
      <div className="flex flex-col gap-3 animate-in-fade-up max-w-2xl">
        <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Knowledge Management</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
          Train your AI Assistant
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Upload your documentation to create a personalized knowledge base.
          Supported formats include PDF, DOCX, and TXT files.
        </p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "relative group overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ease-out cursor-pointer flex flex-col items-center justify-center p-16 text-center",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01] shadow-2xl shadow-primary/10"
            : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
        <input {...getInputProps()} />

        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner ring-1 ring-white/20">
          <UploadCloud className="h-10 w-10 text-primary drop-shadow-md" />
        </div>

        <div className="space-y-2 relative z-10">
          <p className="text-2xl font-semibold text-foreground">
            {isDragActive ? "Drop files immediately" : "Click or drag files to upload"}
          </p>
          <p className="text-base text-muted-foreground">
            Max file size 10MB per document
          </p>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span>Documents</span>
            <span className="text-sm font-normal text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{documents.length}</span>
          </h2>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/50">
            <p>No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {documents.map((doc, i) => (
              <Card
                key={doc.id}
                className={cn(
                  "glass-card group relative overflow-hidden border-0",
                  "animate-in-fade-up"
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Progress Bar Background for Processing */}
                {(doc.status === "uploading" || doc.status === "processing") && (
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full z-0"
                  >
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${doc.progress}%` }}
                    />
                  </div>
                )}

                <CardContent className="p-5 flex items-start gap-4 relative z-10">
                  <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                    doc.type === 'PDF' ? 'bg-red-500/10 text-red-500' :
                      doc.type === 'DOCX' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-gray-500/10 text-gray-500'
                  )}>
                    <FileText className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold truncate text-foreground leading-tight" title={doc.name}>{doc.name}</h3>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 hover:text-destructive rounded-md">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove "{doc.name}" from your knowledge base. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(doc.id)} className="bg-destructive hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-medium">{doc.size}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span>{doc.uploadDate}</span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        doc.status === 'ready' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" :
                          doc.status === 'error' ? "bg-destructive" :
                            "bg-primary animate-pulse"
                      )} />
                      <span className="text-xs font-medium capitalize text-foreground/80">
                        {doc.status === 'processing' ? `Processing ${doc.progress}%` : doc.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
