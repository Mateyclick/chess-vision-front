
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp } from 'lucide-react';

interface AnalysisPanelProps {
  evaluation: number;
  bestMove: string;
  principalVariation: string[];
}

const AnalysisPanel = ({ evaluation, bestMove, principalVariation }: AnalysisPanelProps) => {
  const getEvaluationDescription = () => {
    if (evaluation > 2) return 'Ventaja decisiva para las blancas';
    if (evaluation > 1) return 'Clara ventaja de las blancas';
    if (evaluation > 0.5) return 'Ligera ventaja de las blancas';
    if (evaluation > -0.5) return 'Posición equilibrada';
    if (evaluation > -1) return 'Ligera ventaja de las negras';
    if (evaluation > -2) return 'Clara ventaja de las negras';
    return 'Ventaja decisiva para las negras';
  };

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Análisis de Stockfish</h3>
        </div>

        {/* Evaluación */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Evaluación</span>
            <Badge 
              variant="outline" 
              className={`border-slate-600 ${
                evaluation > 0 ? 'text-green-400' : evaluation < 0 ? 'text-red-400' : 'text-yellow-400'
              }`}
            >
              {evaluation > 0 ? '+' : ''}{evaluation.toFixed(2)}
            </Badge>
          </div>
          <p className="text-sm text-slate-300">{getEvaluationDescription()}</p>
        </div>

        {/* Mejor jugada */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-slate-300">Mejor jugada</span>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
            <span className="text-white font-mono text-lg">{bestMove || 'Calculando...'}</span>
          </div>
        </div>

        {/* Línea principal */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-300">Línea principal</span>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600 max-h-32 overflow-y-auto">
            {principalVariation.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {principalVariation.map((move, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-slate-700 text-slate-200 text-xs"
                  >
                    {index + 1}. {move}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-slate-500 text-sm">Calculando variación...</span>
            )}
          </div>
        </div>

        {/* Métricas adicionales */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-600">
          <div className="text-center">
            <div className="text-xs text-slate-400">Profundidad</div>
            <div className="text-lg font-bold text-white">18</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400">Nodos/seg</div>
            <div className="text-lg font-bold text-white">2.1M</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnalysisPanel;
