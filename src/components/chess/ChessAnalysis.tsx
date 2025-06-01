
import { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, RotateCcw, ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import EvaluationBar from './EvaluationBar';
import MovesList from './MovesList';
import AnalysisPanel from './AnalysisPanel';
import { toast } from 'sonner';

const ChessAnalysis = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [pgnInput, setPgnInput] = useState('');
  const [evaluation, setEvaluation] = useState(0);
  const [bestMove, setBestMove] = useState('');
  const [principalVariation, setPrincipalVariation] = useState<string[]>([]);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');

  // Simular análisis de Stockfish (aquí conectarías con tu backend)
  const analyzePosition = useCallback((fen: string) => {
    // Simulación de evaluación (reemplazar con llamada real al backend)
    const randomEval = (Math.random() - 0.5) * 4;
    setEvaluation(randomEval);
    setBestMove('e2e4'); // Ejemplo
    setPrincipalVariation(['e2e4', 'd7d5', 'e4d5']); // Ejemplo
  }, []);

  const loadPGN = () => {
    try {
      const newGame = new Chess();
      newGame.loadPgn(pgnInput);
      
      // Obtener historial de jugadas
      const history = newGame.history();
      setMoveHistory(history);
      
      // Resetear al inicio
      const gameFromStart = new Chess();
      setGame(gameFromStart);
      setPosition(gameFromStart.fen());
      setCurrentMoveIndex(-1);
      
      toast.success('PGN cargado exitosamente');
      analyzePosition(gameFromStart.fen());
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
    setBestMove('');
    setPrincipalVariation([]);
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
    analyzePosition(newGame.fen());
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

  useEffect(() => {
    analyzePosition(position);
  }, [position, analyzePosition]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
      {/* Panel de carga de PGN */}
      <Card className="lg:col-span-12 p-6 bg-slate-800/50 border-slate-700">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Cargar PGN</h3>
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
              Cargar PGN
            </Button>
            <Button onClick={resetGame} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetear
            </Button>
          </div>
        </div>
      </Card>

      {/* Barra de evaluación */}
      <div className="lg:col-span-1">
        <EvaluationBar evaluation={evaluation} />
      </div>

      {/* Tablero */}
      <Card className="lg:col-span-7 p-4 bg-slate-800/50 border-slate-700">
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

          {/* Controles de navegación */}
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

      {/* Panel de análisis */}
      <div className="lg:col-span-4 space-y-6">
        <AnalysisPanel
          evaluation={evaluation}
          bestMove={bestMove}
          principalVariation={principalVariation}
        />
        
        <MovesList
          moves={moveHistory}
          currentMoveIndex={currentMoveIndex}
          onMoveClick={goToMove}
        />
      </div>
    </div>
  );
};

export default ChessAnalysis;
