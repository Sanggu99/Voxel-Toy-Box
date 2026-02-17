
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LandmarkType, SimulationState, VoxelData } from './types';
import { LANDMARKS } from './constants';
import { generateVoxels } from './services/voxelGenerator';
import { getLandmarkFact } from './services/geminiService';
import VoxelStage from './components/VoxelStage';

const App: React.FC = () => {
  const [activeLandmark, setActiveLandmark] = useState<LandmarkType>(LandmarkType.EIFFEL_TOWER);
  const [simulationState, setSimulationState] = useState<SimulationState>(SimulationState.IDLE);
  const [voxels, setVoxels] = useState<VoxelData[]>([]);
  const [fact, setFact] = useState<string>("");
  const [loadingFact, setLoadingFact] = useState(false);
  
  // Use ReturnType<typeof setTimeout> to avoid NodeJS namespace dependency in browser environments
  const buildTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentRequestId = useRef<number>(0);

  const startBuildProcess = useCallback(async (type: LandmarkType) => {
    // 1. Increment request ID to ignore stale AI responses
    const requestId = ++currentRequestId.current;

    // 2. Clear previous transition timers
    if (buildTimerRef.current) {
      clearTimeout(buildTimerRef.current);
    }

    // 3. Reset and Start Build Animation
    setSimulationState(SimulationState.IDLE);
    setFact("");
    
    // Use requestAnimationFrame for a cleaner reset before starting the next build
    requestAnimationFrame(() => {
      const newVoxels = generateVoxels(type);
      setVoxels(newVoxels);
      setSimulationState(SimulationState.BUILDING);
      
      // A. Start the AI Fact Loading (Parallel, non-blocking)
      setLoadingFact(true);
      getLandmarkFact(LANDMARKS[type].name).then((newFact) => {
        // Only update if this is still the most recent request
        if (requestId === currentRequestId.current) {
          setFact(newFact);
          setLoadingFact(false);
        }
      });

      // B. Schedule the transition to READY based on animation length
      // 1500 voxels per second + constant offset
      const buildDuration = (newVoxels.length / 1500) * 1000 + 500;
      
      buildTimerRef.current = setTimeout(() => {
        if (requestId === currentRequestId.current) {
          setSimulationState(SimulationState.READY);
        }
      }, buildDuration);
    });
  }, []);

  // Effect triggers on landmark change
  useEffect(() => {
    startBuildProcess(activeLandmark);
    return () => {
      if (buildTimerRef.current) clearTimeout(buildTimerRef.current);
    };
  }, [activeLandmark, startBuildProcess]);

  const handleLandmarkChange = (type: LandmarkType) => {
    if (activeLandmark === type) {
      // Re-trigger build even if already active
      startBuildProcess(type);
    } else {
      setActiveLandmark(type);
    }
  };

  const triggerBreak = () => {
    if (buildTimerRef.current) clearTimeout(buildTimerRef.current);
    setSimulationState(SimulationState.BREAKING);
  };

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row overflow-hidden bg-slate-50">
      {/* Sidebar UI */}
      <div className="z-10 w-full md:w-96 p-6 flex flex-col gap-6 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-slate-200 overflow-y-auto">
        <header>
          <div className="flex items-center gap-2">
            <span className="text-3xl drop-shadow-sm">🧱</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">Voxel Toy</h1>
          </div>
          <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest opacity-70">Architecture Sandbox</p>
        </header>

        <section className="flex flex-col gap-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Select Landmark</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(LANDMARKS).map((landmark) => (
              <button
                key={landmark.id}
                onClick={() => handleLandmarkChange(landmark.id)}
                className={`group p-3 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-2 border-2 text-center h-28 cursor-pointer
                  ${activeLandmark === landmark.id 
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-sm ring-4 ring-indigo-500/10' 
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-white hover:text-slate-600'}`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {landmark.country.split(' ').pop()}
                </span>
                <span className="text-[10px] font-black leading-tight uppercase tracking-wider">
                  {landmark.name.split(' ')[0]}<br/>{landmark.name.split(' ').slice(1).join(' ')}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-indigo-400 text-xl font-bold">#</span>
              <h2 className="text-xl font-black tracking-tight">{LANDMARKS[activeLandmark].name}</h2>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">
              {LANDMARKS[activeLandmark].description}
            </p>
            
            <div className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed transition-all duration-500 min-h-[70px] flex items-center
              ${loadingFact ? 'bg-white/5 text-white/30 animate-pulse' : 'bg-white/10 text-indigo-100 shadow-inner'}`}>
              {loadingFact ? 'AI is thinking...' : (fact || 'Waiting for history...')}
            </div>
          </div>
        </section>

        <section className="mt-auto flex flex-col gap-3 pb-2">
          <button
            onClick={() => startBuildProcess(activeLandmark)}
            className="group w-full py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold hover:border-indigo-500 hover:text-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
            Rebuild
          </button>
          
          <button
            onClick={triggerBreak}
            disabled={simulationState === SimulationState.IDLE || simulationState === SimulationState.BREAKING}
            className="w-full py-5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black tracking-widest uppercase shadow-lg shadow-rose-200 transition-all active:scale-95 active:shadow-none disabled:opacity-30 disabled:grayscale"
          >
            💥 BREAK APART
          </button>
        </section>
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-1 relative bg-slate-100">
        <div className="absolute top-8 left-8 z-10 pointer-events-none">
          <div className="px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white text-[10px] font-black text-slate-800 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                simulationState === SimulationState.READY ? 'bg-emerald-500' : 
                simulationState === SimulationState.BUILDING ? 'bg-indigo-500 animate-ping' : 
                simulationState === SimulationState.BREAKING ? 'bg-rose-500' : 'bg-slate-300'
              }`} />
              <span className="tracking-[0.15em] uppercase">{simulationState}</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <span className="text-slate-400 tracking-widest">{voxels.length} BLOCKS</span>
          </div>
        </div>
        
        <VoxelStage voxels={voxels} state={simulationState} />
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-slate-400 text-[10px] pointer-events-none uppercase tracking-[0.3em] font-black bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm border border-white/20">
          Orbit to Rotate • Scroll to Zoom
        </div>
      </div>
    </div>
  );
};

export default App;
