
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { EvaluationPoint } from './types';

interface EvaluationGraphProps {
  evaluations: EvaluationPoint[];
  onTurnHover?: (turn: number) => void;
  onTurnClick?: (turn: number) => void;
}

const EvaluationGraph = ({ evaluations, onTurnHover, onTurnClick }: EvaluationGraphProps) => {
  const data = evaluations.map(point => ({
    turn: point.turn,
    evaluation: Math.max(-500, Math.min(500, point.evaluation)), // Clamp between -500 and +500
    classification: point.classification
  }));

  const getPointColor = (classification: string) => {
    switch (classification) {
      case 'blunder': return '#ef4444';
      case 'mistake': return '#f97316';
      case 'brilliant': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm">
          <div>Jugada: {label}</div>
          <div>Evaluación: {data.evaluation > 0 ? '+' : ''}{(data.evaluation / 100).toFixed(2)}</div>
          <div>Clasificación: {data.classification}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Evaluación de la Partida</h3>
        <p className="text-sm text-slate-400">Ventaja por jugada (centipawns)</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="turn" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              domain={[-500, 500]}
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `${value > 0 ? '+' : ''}${(value / 100).toFixed(1)}`}
            />
            <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="2 2" />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="evaluation" 
              stroke="#64748b"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={payload.classification === 'blunder' || payload.classification === 'brilliant' ? 4 : 2}
                    fill={getPointColor(payload.classification)}
                    stroke={getPointColor(payload.classification)}
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onTurnClick?.(payload.turn)}
                    onMouseEnter={() => onTurnHover?.(payload.turn)}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-slate-400">Ventaja Blancas</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
          <span className="text-slate-400">Equilibrio</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-slate-400">Ventaja Negras</span>
        </div>
      </div>
    </Card>
  );
};

export default EvaluationGraph;
