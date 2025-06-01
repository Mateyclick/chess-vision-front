
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MoveTurn, AnalyzedMove } from './types';
import { Check, AlertTriangle, X, Flame, Star, CheckCircle } from 'lucide-react';

interface MoveSidebarProps {
  turns: MoveTurn[];
  onMoveClick: (fen: string) => void;
  currentFen?: string;
}

const getClassificationIcon = (classification: AnalyzedMove['classification']) => {
  switch (classification) {
    case 'perfect':
    case 'excellent':
      return <Check className="w-3 h-3 text-green-500" />;
    case 'good':
      return <CheckCircle className="w-3 h-3 text-green-400" />;
    case 'inaccuracy':
      return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
    case 'mistake':
      return <X className="w-3 h-3 text-orange-500" />;
    case 'blunder':
      return <Flame className="w-3 h-3 text-red-500" />;
    case 'brilliant':
      return <Star className="w-3 h-3 text-blue-500" />;
    default:
      return null;
  }
};

const getClassificationColor = (classification: AnalyzedMove['classification']) => {
  switch (classification) {
    case 'perfect':
    case 'excellent':
      return 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30';
    case 'good':
      return 'bg-green-400/20 border-green-400/50 hover:bg-green-400/30';
    case 'inaccuracy':
      return 'bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30';
    case 'mistake':
      return 'bg-orange-500/20 border-orange-500/50 hover:bg-orange-500/30';
    case 'blunder':
      return 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30';
    case 'brilliant':
      return 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30 animate-pulse';
    default:
      return 'bg-slate-700/50 border-slate-600 hover:bg-slate-600/50';
  }
};

const getClassificationText = (classification: AnalyzedMove['classification']) => {
  switch (classification) {
    case 'perfect': return 'Perfecta';
    case 'excellent': return 'Excelente';
    case 'good': return 'Buena';
    case 'inaccuracy': return 'Imprecisión';
    case 'mistake': return 'Error';
    case 'blunder': return 'Blunder';
    case 'brilliant': return 'Brillante';
    default: return '';
  }
};

interface MoveButtonProps {
  move: AnalyzedMove;
  isActive: boolean;
  onClick: () => void;
}

const MoveButton = ({ move, isActive, onClick }: MoveButtonProps) => {
  const baseClasses = "px-2 py-1 rounded text-sm font-mono border transition-all duration-200 cursor-pointer flex items-center gap-1";
  const colorClasses = getClassificationColor(move.classification);
  const activeClasses = isActive ? "ring-2 ring-blue-400" : "";
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`${baseClasses} ${colorClasses} ${activeClasses}`}
          onClick={onClick}
        >
          {getClassificationIcon(move.classification)}
          <span className="text-white">{move.move}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs">
        <div className="space-y-1">
          <div className="font-semibold">{getClassificationText(move.classification)}</div>
          <div className="text-xs">
            <div>Evaluación: {move.evaluationBefore > 0 ? '+' : ''}{(move.evaluationBefore / 100).toFixed(2)} → {move.evaluationAfter > 0 ? '+' : ''}{(move.evaluationAfter / 100).toFixed(2)}</div>
            <div>Mejor jugada: {move.bestMove}</div>
            <div>Pérdida: {(move.evaluationLoss / 100).toFixed(2)}</div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const MoveSidebar = ({ turns, onMoveClick, currentFen }: MoveSidebarProps) => {
  return (
    <Card className="h-full bg-slate-800/50 border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">Análisis de Jugadas</h3>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="p-4 space-y-2">
          {turns.map((turn) => (
            <div key={turn.turnNumber} className="flex items-center gap-2">
              <span className="text-slate-400 text-sm w-8 flex-shrink-0">
                {turn.turnNumber}.
              </span>
              
              <div className="flex gap-2 flex-1">
                {turn.whiteMove && (
                  <MoveButton
                    move={turn.whiteMove}
                    isActive={currentFen === turn.whiteMove.fenAfter}
                    onClick={() => onMoveClick(turn.whiteMove!.fenAfter)}
                  />
                )}
                
                {turn.blackMove && (
                  <MoveButton
                    move={turn.blackMove}
                    isActive={currentFen === turn.blackMove.fenAfter}
                    onClick={() => onMoveClick(turn.blackMove!.fenAfter)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default MoveSidebar;
