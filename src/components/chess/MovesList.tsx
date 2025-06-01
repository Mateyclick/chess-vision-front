
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface MovesListProps {
  moves: string[];
  currentMoveIndex: number;
  onMoveClick: (moveIndex: number) => void;
}

const MovesList = ({ moves, currentMoveIndex, onMoveClick }: MovesListProps) => {
  const groupedMoves = [];
  for (let i = 0; i < moves.length; i += 2) {
    groupedMoves.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null,
      whiteIndex: i,
      blackIndex: i + 1,
    });
  }

  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Historial de jugadas</h3>
        </div>

        <ScrollArea className="h-64">
          <div className="space-y-1">
            {groupedMoves.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">No hay jugadas cargadas</p>
              </div>
            ) : (
              groupedMoves.map((group) => (
                <div key={group.moveNumber} className="flex items-center gap-2 py-1">
                  <span className="text-xs text-slate-400 w-8 flex-shrink-0">
                    {group.moveNumber}.
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2 text-sm font-mono flex-1 justify-start ${
                      currentMoveIndex === group.whiteIndex
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                    onClick={() => onMoveClick(group.whiteIndex)}
                  >
                    {group.white}
                  </Button>
                  
                  {group.black && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 text-sm font-mono flex-1 justify-start ${
                        currentMoveIndex === group.blackIndex
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                      onClick={() => onMoveClick(group.blackIndex)}
                    >
                      {group.black}
                    </Button>
                  )}
                  
                  {!group.black && <div className="flex-1" />}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default MovesList;
