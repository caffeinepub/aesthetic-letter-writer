import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import type { Letter } from "./backend.d";
import { ComposeView } from "./components/ComposeView";
import { LetterDetailView } from "./components/LetterDetailView";
import { LettersView } from "./components/LettersView";

export type View = "compose" | "letters" | "detail";

function App() {
  const [view, setView] = useState<View>("compose");
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  const goToCompose = () => setView("compose");
  const goToLetters = () => setView("letters");
  const goToDetail = (letter: Letter) => {
    setSelectedLetter(letter);
    setView("detail");
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      {view === "compose" && (
        <ComposeView onSuccess={goToLetters} onViewLetters={goToLetters} />
      )}
      {view === "letters" && (
        <LettersView onCompose={goToCompose} onOpenLetter={goToDetail} />
      )}
      {view === "detail" && selectedLetter && (
        <LetterDetailView
          letter={selectedLetter}
          onBack={goToLetters}
          onCompose={goToCompose}
        />
      )}
    </div>
  );
}

export default App;
