
import { Card } from '@/components/ui/card';

interface EvaluationBarProps {
  evaluation: number;
}

const EvaluationBar = ({ evaluation }: EvaluationBarProps) => {
  // Convertir evaluación a porcentaje (0 = negro gana, 100 = blanco gana)
  const percentage = Math.max(0, Math.min(100, 50 + (evaluation * 10)));
  
  const getEvaluationText = () => {
    if (evaluation > 3) return '+M';
    if (evaluation < -3) return '-M';
    return evaluation > 0 ? `+${evaluation.toFixed(1)}` : evaluation.toFixed(1);
  };

  const getEvaluationColor = () => {
    if (evaluation > 1) return 'text-green-400';
    if (evaluation < -1) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <Card className="h-full min-h-[400px] bg-slate-800/50 border-slate-700 p-4">
      <div className="h-full flex flex-col">
        <div className="text-center mb-4">
          <div className="text-xs font-medium text-slate-400 mb-2">EVALUACIÓN</div>
          <div className={`text-lg font-bold ${getEvaluationColor()}`}>
            {getEvaluationText()}
          </div>
        </div>
        
        <div className="flex-1 relative bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
          {/* Parte blanca */}
          <div 
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-slate-100 to-slate-300 transition-all duration-500 ease-out"
            style={{ height: `${percentage}%` }}
          />
          
          {/* Parte negra */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-700 transition-all duration-500 ease-out"
            style={{ height: `${100 - percentage}%` }}
          />
          
          {/* Línea central */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-400 transform -translate-y-1/2 opacity-30" />
          
          {/* Indicadores de lado */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-800 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-800">♔</span>
            </div>
          </div>
          
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-300 flex items-center justify-center">
              <span className="text-xs font-bold text-white">♚</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-slate-400 text-center">
          <div>Ventaja: {percentage > 50 ? 'Blancas' : 'Negras'}</div>
        </div>
      </div>
    </Card>
  );
};

export default EvaluationBar;
