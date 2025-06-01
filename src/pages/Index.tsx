
import ChessAnalysis from '../components/chess/ChessAnalysis';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Tablero de Análisis
          </h1>
          <p className="text-slate-300 text-lg">
            Análisis profesional de partidas de ajedrez con Stockfish
          </p>
        </div>
        <ChessAnalysis />
      </div>
    </div>
  );
};

export default Index;
