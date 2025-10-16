import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Users, Drumstick } from "lucide-react";
import { toast } from "sonner";
import mandiBack from "@/assets/mandi_back.jpg";
import mandiBack2 from "@/assets/mandi_back2.jpg";

type InputMode = "quarters" | "custom" | "manual";
type PieceType = "chest" | "leg";

interface Quarter {
  id: number;
  type: PieceType;
}

interface Assignment {
  person: string;
  piece: PieceType;
}

const Index = () => {
  const [inputMode, setInputMode] = useState<InputMode>("quarters");
  const [quarters, setQuarters] = useState<number>(2);
  const [customQuarters, setCustomQuarters] = useState<Quarter[]>([
    { id: 1, type: "chest" },
    { id: 2, type: "leg" },
  ]);
  const [chestCount, setChestCount] = useState(0);
  const [legCount, setLegCount] = useState(0);
  const [people, setPeople] = useState<string[]>([]);
  const [personInput, setPersonInput] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [lastResult, setLastResult] = useState<{ person: string; piece: PieceType } | null>(null);

  // Calculate pieces based on quarters
  const calculatePiecesFromQuarters = (numQuarters: number) => {
    const chest = Math.floor(numQuarters / 2);
    const leg = Math.ceil(numQuarters / 2);
    return { chest, leg };
  };

  // Get current piece counts based on mode
  const getCurrentPieceCounts = () => {
    if (inputMode === "quarters") {
      return calculatePiecesFromQuarters(quarters);
    } else if (inputMode === "custom") {
      const chest = customQuarters.filter((q) => q.type === "chest").length;
      const leg = customQuarters.filter((q) => q.type === "leg").length;
      return { chest, leg };
    } else {
      return { chest: chestCount, leg: legCount };
    }
  };

  const { chest: totalChest, leg: totalLeg } = getCurrentPieceCounts();
  const assignedChest = assignments.filter((a) => a.piece === "chest").length;
  const assignedLeg = assignments.filter((a) => a.piece === "leg").length;
  const remainingChest = totalChest - assignedChest;
  const remainingLeg = totalLeg - assignedLeg;
  const remainingTotal = remainingChest + remainingLeg;
  const remainingPeople = people.filter((p) => !assignments.some((a) => a.person === p));

  // Handle quarters input change
  const handleQuartersChange = (value: number) => {
    const numQuarters = Math.max(0, value);
    setQuarters(numQuarters);
    
    // Update custom quarters array
    const newQuarters: Quarter[] = [];
    for (let i = 1; i <= numQuarters; i++) {
      newQuarters.push({
        id: i,
        type: i % 2 === 1 ? "chest" : "leg",
      });
    }
    setCustomQuarters(newQuarters);
  };

  // Toggle quarter type
  const toggleQuarterType = (id: number) => {
    setCustomQuarters((prev) =>
      prev.map((q) => (q.id === id ? { ...q, type: q.type === "chest" ? "leg" : "chest" } : q))
    );
  };

  // Add person
  const addPerson = () => {
    const name = personInput.trim();
    if (!name) {
      toast.error("Please enter a name");
      return;
    }
    if (people.includes(name)) {
      toast.error("This person is already added");
      return;
    }
    setPeople([...people, name]);
    setPersonInput("");
    toast.success(`${name} added!`);
  };

  // Remove person
  const removePerson = (name: string) => {
    setPeople(people.filter((p) => p !== name));
    toast.success(`${name} removed`);
  };

  // Spin the wheel
  const spinWheel = () => {
    if (remainingPeople.length === 0) {
      toast.error("No people available to spin!");
      return;
    }
    if (remainingTotal === 0) {
      toast.error("No pieces remaining!");
      return;
    }

    setIsSpinning(true);
    setLastResult(null);

    // Simulate spinning animation
    setTimeout(() => {
      // Randomly select person
      const randomPerson = remainingPeople[Math.floor(Math.random() * remainingPeople.length)];

      // Randomly select piece type weighted by availability
      const totalPieces = remainingChest + remainingLeg;
      const chestProbability = remainingChest / totalPieces;
      const randomValue = Math.random();
      const selectedPiece: PieceType = randomValue < chestProbability ? "chest" : "leg";

      // Add assignment
      const newAssignment = { person: randomPerson, piece: selectedPiece };
      setAssignments([...assignments, newAssignment]);
      setLastResult(newAssignment);
      setIsSpinning(false);

      toast.success(
        `🎉 ${randomPerson} gets a ${selectedPiece === "chest" ? "🍗 CHEST" : "🍖 LEG"} piece!`,
        { duration: 5000 }
      );
    }, 3000);
  };

  // Reset everything
  const resetAll = () => {
    setInputMode("quarters");
    setQuarters(2);
    setCustomQuarters([
      { id: 1, type: "chest" },
      { id: 2, type: "leg" },
    ]);
    setChestCount(0);
    setLegCount(0);
    setPeople([]);
    setPersonInput("");
    setAssignments([]);
    setLastResult(null);
    toast.success("Reset complete!");
  };

  // Calculate wheel segment sizes
  const getWheelSegments = () => {
    const total = remainingChest + remainingLeg;
    if (total === 0) return { chestPercent: 50, legPercent: 50 };
    return {
      chestPercent: (remainingChest / total) * 100,
      legPercent: (remainingLeg / total) * 100,
    };
  };

  const { chestPercent, legPercent } = getWheelSegments();

  return (
    <div 
      className="min-h-screen bg-gradient-warm py-8 px-4 relative"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(139, 69, 19, 0.85) 0%, rgba(218, 165, 32, 0.85) 100%), url(${mandiBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-bounce-in">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            🍗 Mandi Spinner 🍗
          </h1>
          <p className="text-xl text-white/90 font-medium">Fair & Square Chicken Distribution</p>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Input Mode Selector */}
          <Card className="p-6 shadow-card bg-white/95 backdrop-blur">
            <h2 className="text-2xl font-bold text-foreground mb-4">📝 Setup Pieces</h2>
            
            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <Button
                variant={inputMode === "quarters" ? "default" : "outline"}
                onClick={() => setInputMode("quarters")}
                disabled={isSpinning}
                className="flex-1 min-w-[120px]"
              >
                Quarters Mode
              </Button>
              <Button
                variant={inputMode === "custom" ? "default" : "outline"}
                onClick={() => setInputMode("custom")}
                disabled={isSpinning}
                className="flex-1 min-w-[120px]"
              >
                Custom Quarters
              </Button>
              <Button
                variant={inputMode === "manual" ? "default" : "outline"}
                onClick={() => setInputMode("manual")}
                disabled={isSpinning}
                className="flex-1 min-w-[120px]"
              >
                Manual Mode
              </Button>
            </div>

            {/* Quarters Mode */}
            {inputMode === "quarters" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Number of Quarters
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={quarters}
                    onChange={(e) => handleQuartersChange(parseInt(e.target.value) || 0)}
                    disabled={isSpinning}
                    className="max-w-xs"
                  />
                </div>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Formula:</strong> 2 Quarters (Half) = 1 Chest + 1 Leg
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Formula:</strong> 4 Quarters (Full) = 2 Chest + 2 Legs
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {quarters} Quarter{quarters !== 1 ? "s" : ""} = {totalChest} Chest + {totalLeg}{" "}
                    Leg{totalLeg !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            {/* Custom Quarters Mode */}
            {inputMode === "custom" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Number of Quarters
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={customQuarters.length}
                    onChange={(e) => handleQuartersChange(parseInt(e.target.value) || 0)}
                    disabled={isSpinning}
                    className="max-w-xs"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Click quarters to toggle between Chest and Leg:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {customQuarters.map((quarter) => (
                      <button
                        key={quarter.id}
                        onClick={() => toggleQuarterType(quarter.id)}
                        disabled={isSpinning}
                        className={`min-h-[100px] rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${
                          quarter.type === "chest"
                            ? "bg-chest hover:bg-chest/90"
                            : "bg-leg hover:bg-leg/90 text-foreground"
                        } ${isSpinning ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="text-sm opacity-80 mb-1">Q{quarter.id}</div>
                        <div className="text-2xl mb-1">{quarter.type === "chest" ? "🍗" : "🍖"}</div>
                        <div className="text-sm font-semibold uppercase">
                          {quarter.type}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-foreground">
                    Your Selection: {totalChest} Chest + {totalLeg} Leg{totalLeg !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            {/* Manual Mode */}
            {inputMode === "manual" && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      🍗 Chest Pieces
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={chestCount}
                      onChange={(e) => setChestCount(Math.max(0, parseInt(e.target.value) || 0))}
                      disabled={isSpinning}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      🍖 Leg Pieces
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={legCount}
                      onChange={(e) => setLegCount(Math.max(0, parseInt(e.target.value) || 0))}
                      disabled={isSpinning}
                    />
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-foreground">
                    Total: {totalChest + totalLeg} pieces ({totalChest} Chest + {totalLeg} Leg
                    {totalLeg !== 1 ? "s" : ""})
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* People Management */}
          <Card className="p-6 shadow-card bg-white/95 backdrop-blur">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Add People
            </h2>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter person's name"
                value={personInput}
                onChange={(e) => setPersonInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPerson()}
                disabled={isSpinning}
                className="flex-1"
              />
              <Button onClick={addPerson} disabled={isSpinning}>
                Add
              </Button>
            </div>
            {people.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {people.map((person) => (
                  <Badge
                    key={person}
                    variant={assignments.some((a) => a.person === person) ? "secondary" : "default"}
                    className="text-sm py-2 px-3 flex items-center gap-2"
                  >
                    {person}
                    {!assignments.some((a) => a.person === person) && (
                      <button
                        onClick={() => removePerson(person)}
                        disabled={isSpinning}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Spinning Wheel */}
          <Card className="p-6 shadow-card bg-white/95 backdrop-blur">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Drumstick className="w-6 h-6" />
              Spin the Wheel
            </h2>

            {/* Wheel Visualization */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-64 h-64 mb-4">
                <div
                  className={`absolute inset-0 rounded-full overflow-hidden shadow-warm ${
                    isSpinning ? "animate-spin-wheel" : ""
                  }`}
                  style={{
                    background: `conic-gradient(hsl(var(--chest)) 0% ${chestPercent}%, hsl(var(--leg)) ${chestPercent}% 100%)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold text-foreground">
                      {isSpinning ? "🎲" : "🎯"}
                    </div>
                  </div>
                </div>
                {/* Pointer */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-accent"></div>
                </div>
              </div>

              {isSpinning && (
                <p className="text-2xl font-bold text-primary animate-pulse-glow">SPINNING...</p>
              )}

              {lastResult && !isSpinning && (
                <div className="text-center animate-bounce-in">
                  <p className="text-3xl font-bold text-foreground mb-2">
                    🎉 {lastResult.person} 🎉
                  </p>
                  <p className="text-xl font-semibold">
                    Gets a{" "}
                    <span
                      className={lastResult.piece === "chest" ? "text-chest" : "text-leg"}
                    >
                      {lastResult.piece === "chest" ? "🍗 CHEST" : "🍖 LEG"}
                    </span>{" "}
                    piece!
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-muted/50 p-4 rounded-lg mb-4 space-y-2">
              <p className="text-sm text-foreground">
                <strong>Remaining:</strong> {remainingTotal} pieces ({remainingChest} Chest,{" "}
                {remainingLeg} Legs) | {remainingPeople.length} people
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>🍗 Chest: {chestPercent.toFixed(0)}%</span>
                <span>🍖 Leg: {legPercent.toFixed(0)}%</span>
              </div>
            </div>

            {/* Spin Button */}
            <Button
              onClick={spinWheel}
              disabled={isSpinning || remainingPeople.length === 0 || remainingTotal === 0}
              className="w-full text-lg py-6 font-bold shadow-warm hover:shadow-lg transition-all"
              size="lg"
            >
              {isSpinning ? "🎲 SPINNING..." : "🎯 SPIN THE WHEEL"}
            </Button>
          </Card>

          {/* Assignments History */}
          {assignments.length > 0 && (
            <Card className="p-6 shadow-card bg-white/95 backdrop-blur">
              <h2 className="text-2xl font-bold text-foreground mb-4">📋 Assignments</h2>
              <div className="space-y-2">
                {assignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <span className="font-medium text-foreground">{assignment.person}</span>
                    <Badge
                      className={
                        assignment.piece === "chest"
                          ? "bg-chest text-chest-foreground"
                          : "bg-leg text-leg-foreground"
                      }
                    >
                      {assignment.piece === "chest" ? "🍗 CHEST" : "🍖 LEG"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button
              onClick={resetAll}
              variant="destructive"
              className="px-8"
              disabled={isSpinning}
            >
              Reset Everything
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
