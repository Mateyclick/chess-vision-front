
export type MoveClassification = 
  | "perfect" 
  | "excellent" 
  | "good" 
  | "inaccuracy" 
  | "mistake" 
  | "blunder" 
  | "brilliant";

export type AnalyzedMove = {
  move: string; // "e4"
  from: string; // "e2"
  to: string;   // "e4"
  fenBefore: string;
  fenAfter: string;
  evaluationBefore: number; // En centipawns
  evaluationAfter: number;
  evaluationLoss: number;
  bestMove: string;
  classification: MoveClassification;
};

export type MoveTurn = {
  turnNumber: number;
  whiteMove?: AnalyzedMove;
  blackMove?: AnalyzedMove;
};

export type EvaluationPoint = {
  turn: number;
  evaluation: number; // + = ventaja blanca, - = ventaja negra
  classification: MoveClassification;
};

export type AnalysisSummary = {
  whiteAccuracy: number;
  blackAccuracy: number;
  inaccuracyCount: number;
  mistakeCount: number;
  blunderCount: number;
  brilliantCount: number;
  openingName: string;
};
