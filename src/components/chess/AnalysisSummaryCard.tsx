
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AnalysisSummary } from './types';
import { CheckCircle, AlertTriangle, X, Flame, Star } from 'lucide-react';

interface AnalysisSummaryProps {
  summary: AnalysisSummary;
}

const AnalysisSummaryCard = ({ summary }: AnalysisSummaryProps) => {
  const {
    whiteAccuracy,
    blackAccuracy,
    inaccuracyCount,
    mistakeCount,
    blunderCount,
    brilliantCount,
    openingName
  } = summary;

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-500';
    if (accuracy >= 80) return 'text-yellow-500';
    if (accuracy >= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  const getAccuracyBgColor = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-500';
    if (accuracy >= 80) return 'bg-yellow-500';
    if (accuracy >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Resumen del Análisis</h3>
          
          {/* Apertura */}
          <div className="mb-4">
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              📚 {openingName}
            </Badge>
          </div>
        </div>

        {/* Precisión */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-slate-300">Precisión</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-400">Blancas</span>
                <span className={`text-sm font-semibold ${getAccuracyColor(whiteAccuracy)}`}>
                  {whiteAccuracy.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={whiteAccuracy} 
                className="h-2"
                // @ts-ignore - Custom style for progress bar
                style={{ '--progress-background': getAccuracyBgColor(whiteAccuracy) } as any}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-400">Negras</span>
                <span className={`text-sm font-semibold ${getAccuracyColor(blackAccuracy)}`}>
                  {blackAccuracy.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={blackAccuracy} 
                className="h-2"
                // @ts-ignore - Custom style for progress bar
                style={{ '--progress-background': getAccuracyBgColor(blackAccuracy) } as any}
              />
            </div>
          </div>
        </div>

        {/* Estadísticas de jugadas */}
        <div className="space-y-3">
          <h4 className="text-md font-medium text-slate-300">Clasificación de Jugadas</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {brilliantCount > 0 && (
              <div className="flex items-center gap-2 p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Star className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white">{brilliantCount} Brillante{brilliantCount !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {inaccuracyCount > 0 && (
              <div className="flex items-center gap-2 p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">{inaccuracyCount} Imprecision{inaccuracyCount !== 1 ? 'es' : ''}</span>
              </div>
            )}
            
            {mistakeCount > 0 && (
              <div className="flex items-center gap-2 p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
                <X className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-white">{mistakeCount} Error{mistakeCount !== 1 ? 'es' : ''}</span>
              </div>
            )}
            
            {blunderCount > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                <Flame className="w-4 h-4 text-red-400" />
                <span className="text-sm text-white">{blunderCount} Blunder{blunderCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          
          {/* Si no hay errores importantes */}
          {inaccuracyCount === 0 && mistakeCount === 0 && blunderCount === 0 && (
            <div className="flex items-center gap-2 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-white">¡Partida sin errores graves!</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AnalysisSummaryCard;
