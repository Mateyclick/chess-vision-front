
import { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, RotateCcw, ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import EvaluationBar from './EvaluationBar';
import MoveSidebar from './MoveSidebar';
import EvaluationGraph from './EvaluationGraph';
import AnalysisSummaryCard from './AnalysisSummaryCard';
import { MoveTurn, AnalyzedMove, EvaluationPoint, AnalysisSummary } from './types';
import { toast } from 'sonner';

const ChessAnalysis = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [pgnInput, setPgnInput] = useState('');
  const [evaluation, setEvaluation] = useState(0);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  
  // Nuevos estados para el análisis
  const [analyzedTurns, setAnalyzedTurns] = useState<MoveTurn[]>([]);
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationPoint[]>([]);
  const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummary>({
    whiteAccuracy: 95.5,
    blackAccuracy: 92.1,
    inaccuracyCount: 2,
    mistakeCount: 1,
    blunderCount: 0,
    brilliantCount: 1,
    openingName: "Apertura Italiana"
  });

  // Simular datos de análisis (esto vendría del backend)
  const generateMockAnalysis = useCallback((moves: string[]) => {
    const turns: MoveTurn[] = [];
    const evaluations: EvaluationPoint[] = [];
    
    for (let i = 0; i < moves.length; i += 2) {
      const turnNumber = Math.floor(i / 2) + 1;
      const whiteMove = moves[i];
      const blackMove = moves[i + 1];
      
      const turn: MoveTurn = {
        turnNumber,
        whiteMove: whiteMove ? {
          move: whiteMove,
          from: 'e2',
          to: 'e4',
          fenBefore: game.fen(),
          fenAfter: game.fen(),
          evaluationBefore: Math.random() * 200 - 100,
          evaluationAfter: Math.random() * 200 - 100,
          evaluationLoss: Math.random() * 50,
          bestMove: 'e4',
          classification: ['perfect', 'excellent', 'good', 'inaccuracy', 'mistake', 'blunder', 'brilliant'][Math.floor(Math.random() * 7)] as any
        } : undefined,
        blackMove: blackMove ? {
          move: blackMove,
          from: 'e7',
          to: 'e5',
          fenBefore: game.fen(),
          fenAfter: game.fen(),
          evaluationBefore: Math.random() * 200 - 100,
          evaluationAfter: Math.random() * 200 - 100,
          evaluationLoss: Math.random() * 50,
          bestMove: 'e5',
          classification: ['perfect', 'excellent', 'good', 'inaccuracy', 'mistake', 'blunder', 'brilliant'][Math.floor(Math.random() * 7)] as any
        } : undefined
      };
      
      turns.push(turn);
      
      // Agregar puntos de evaluación
      if (turn.whiteMove) {
        evaluations.push({
          turn: turnNumber * 2 - 1,
          evaluation: turn.whiteMove.evaluationAfter,
          classification: turn.whiteMove.classification
        });
      }
      
      if (turn.blackMove) {
        evaluations.push({
          turn: turnNumber * 2,
          evaluation: turn.blackMove.evaluationAfter,
          classification: turn.blackMove.classification
        });
      }
    }
    
    setAnalyzedTurns(turns);
    setEvaluationHistory(evaluations);
  }, [game]);

  const loadPGN = () => {
    try {
      const newGame = new Chess();
      newGame.loadPgn(pgnInput);
      
      const history = newGame.history();
      setMoveHistory(history);
      
      const gameFromStart = new Chess();
      setGame(gameFromStart);
      setPosition(gameFromStart.fen());
      setCurrentMoveIndex(-1);
      
      // Generar análisis simulado
      generateMockAnalysis(history);
      
      toast.success('PGN cargado exitosamente');
    } catch (error) {
      toast.error('Error al cargar el PGN. Verifica el formato.');
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setPosition(newGame.fen());
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    setPgnInput('');
    setEvaluation(0);
    setAnalyzedTurns([]);
    setEvaluationHistory([]);
  };

  const goToMove = (moveIndex: number) => {
    const newGame = new Chess();
    
    for (let i = 0; i <= moveIndex; i++) {
      if (i < moveHistory.length) {
        newGame.move(moveHistory[i]);
      }
    }
    
    setGame(newGame);
    setPosition(newGame.fen());
    setCurrentMoveIndex(moveIndex);
    
    // Actualizar evaluación basada en el historial
    if (evaluationHistory[moveIndex]) {
      setEvaluation(evaluationHistory[moveIndex].evaluation);
    }
  };

  const handleMoveClick = (fen: string) => {
    setPosition(fen);
    // Aquí podrías buscar el índice correspondiente al FEN
    // Por simplicidad, usamos el FEN directamente
  };

  const navigateMove = (direction: 'first' | 'prev' | 'next' | 'last') => {
    let newIndex = currentMoveIndex;
    
    switch (direction) {
      case 'first':
        newIndex = -1;
        break;
      case 'prev':
        newIndex = Math.max(-1, currentMoveIndex - 1);
        break;
      case 'next':
        newIndex = Math.min(moveHistory.length - 1, currentMoveIndex + 1);
        break;
      case 'last':
        newIndex = moveHistory.length - 1;
        break;
    }
    
    if (newIndex !== currentMoveIndex) {
      goToMove(newIndex);
    }
  };

  const flipBoard = () => {
    setBoardOrientation(prev => prev === 'white' ? 'black' : 'white');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
      {/* Panel de carga de PGN */}
      <Card className="lg:col-span-12 p-6 bg-slate-800/50 border-slate-700">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Cargar PGN para Análisis</h3>
          </div>
          
          <Textarea
            placeholder="Pega aquí tu PGN..."
            value={pgnInput}
            onChange={(e) => setPgnInput(e.target.value)}
            className="min-h-[120px] bg-slate-900/50 border-slate-600 text-white resize-none"
          />
          
          <div className="flex gap-2">
            <Button onClick={loadPGN} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Analizar Partida
            </Button>
            <Button onClick={resetGame} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetear
            </Button>
          </div>
        </div>
      </Card>

      {/* Barra lateral de jugadas */}
      <div className="lg:col-span-3">
        <MoveSidebar
          turns={analyzedTurns}
          onMoveClick={handleMoveClick}
          currentFen={position}
        />
      </div>

      {/* Área principal - Tablero y controles */}
      <div className="lg:col-span-6 space-y-6">
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {game.turn() === 'w' ? 'Turno: Blancas' : 'Turno: Negras'}
              </Badge>
              <Button
                onClick={flipBoard}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Girar tablero
              </Button>
            </div>

            <div className="aspect-square w-full max-w-[600px] mx-auto">
              <Chessboard
                position={position}
                boardOrientation={boardOrientation}
                arePiecesDraggable={false}
                customBoardStyle={{
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
                customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
                customDarkSquareStyle={{ backgroundColor: '#b58863' }}
              />
            </div>

            <div className="flex justify-center gap-2">
              <Button
                onClick={() => navigateMove('first')}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                disabled={currentMoveIndex <= -1}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigateMove('prev')}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                disabled={currentMoveIndex <= -1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigateMove('next')}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                disabled={currentMoveIndex >= moveHistory.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigateMove('last')}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                disabled={currentMoveIndex >= moveHistory.length - 1}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Gráfico de evaluación */}
        <EvaluationGraph
          evaluations={evaluationHistory}
          onTurnClick={(turn) => {
            const moveIndex = turn - 1;
            if (moveIndex >= 0 && moveIndex < moveHistory.length) {
              goToMove(moveIndex);
            }
          }}
        />
      </div>

      {/* Panel derecho - Barra de evaluación y resumen */}
      <div className="lg:col-span-3 space-y-6">
        <EvaluationBar evaluation={evaluation} />
        <AnalysisSummaryCard summary={analysisSummary} />
      </div>
    </div>
  );
};

export default ChessAnalysis;
