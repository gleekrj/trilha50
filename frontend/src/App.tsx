import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app.store";

function App() {
  const { title, setTitle } = useAppStore();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        Frontend: React, TypeScript, Zustand e ShadCN. Backend em NestJS na
        pasta{" "}
        <code className="bg-muted rounded px-1 py-0.5 text-xs">backend/</code>.
      </p>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setTitle("Trilha 50+ — pronto")}
      >
        Atualizar título (Zustand)
      </Button>
    </div>
  );
}

export default App;
