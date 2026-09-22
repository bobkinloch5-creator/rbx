import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Cylinder, Float, Text } from '@react-three/drei';
import { useBuilderStore } from '../../hooks/useBuilderStore';
import { 
  Box as CubeIcon, 
  RotateCcw, 
  Plus, 
  Sparkles, 
  Layers, 
  Camera,
  CircleDot
} from 'lucide-react';

function Scene({ showWireframe, localParts }: { showWireframe: boolean; localParts: any[] }) {
  const { projectStructure, setSelectedInstance, selectedInstance } = useBuilderStore();

  // Combine live Studio structure with local demo parts if Studio not yet synced
  const hasLiveStructure = Boolean(projectStructure?.instances && projectStructure.instances.length > 0);
  const instancesToRender = hasLiveStructure ? projectStructure!.instances : localParts;

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[15, 25, 10]} intensity={1.4} castShadow />
      <pointLight position={[-10, 15, -10]} intensity={0.5} color="#38bdf8" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#e74c3c" />

      {/* Roblox Baseplate Grid */}
      <Grid
        position={[0, -0.01, 0]}
        args={[80, 80]}
        cellSize={2}
        cellThickness={0.8}
        cellColor="#334155"
        sectionSize={10}
        sectionThickness={1.5}
        sectionColor="#475569"
        fadeDistance={70}
        fadeStrength={1}
        followCamera={false}
      />

      {/* Baseplate Solid Ground */}
      <Box position={[0, -0.5, 0]} args={[80, 1, 80]}>
        <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.1} />
      </Box>

      {/* Render Instances (Parts, Spawns, Obby Blocks) */}
      {instancesToRender.map((instance: any, idx: number) => {
        const props = instance.Properties || {};
        const pos: [number, number, number] = [
          props.Position?.X ?? (idx * 3 - 6),
          props.Position?.Y ?? (props.Size?.Y ? props.Size.Y / 2 : 1),
          props.Position?.Z ?? 0
        ];
        const size = props.Size || { X: 2, Y: 1, Z: 2 };
        const color = props.Color || (instance.ClassName === 'SpawnLocation' ? '#10b981' : idx % 2 === 0 ? '#e74c3c' : '#38bdf8');
        const isSelected = selectedInstance?.Name === instance.Name;

        if (instance.ClassName === 'SpawnLocation') {
          return (
            <group key={idx} position={pos} onClick={() => setSelectedInstance(instance)}>
              <Cylinder args={[2, 2, 0.4, 32]}>
                <meshStandardMaterial color="#059669" wireframe={showWireframe} metalness={0.2} roughness={0.4} />
              </Cylinder>
              <Text position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.6} color="#ffffff">
                SPAWN
              </Text>
            </group>
          );
        }

        return (
          <group key={idx} position={pos} onClick={() => setSelectedInstance(instance)}>
            <Box args={[size.X, size.Y, size.Z]}>
              <meshStandardMaterial 
                color={isSelected ? '#f59e0b' : color} 
                wireframe={showWireframe}
                roughness={0.3}
                metalness={0.2}
              />
            </Box>
            {isSelected && (
              <Box args={[size.X + 0.15, size.Y + 0.15, size.Z + 0.15]}>
                <meshBasicMaterial color="#fbbf24" wireframe />
              </Box>
            )}
          </group>
        );
      })}

      {/* Playful Floating Voxel Sparkles */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Box position={[0, 6, -5]} args={[1.2, 1.2, 1.2]} rotation={[0.4, 0.4, 0]}>
          <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
        </Box>
        <Box position={[8, 7, -2]} args={[1, 1, 1]} rotation={[0.2, 0.6, 0]}>
          <meshStandardMaterial color="#ec4899" roughness={0.2} metalness={0.8} />
        </Box>
      </Float>

      <OrbitControls makeDefault minDistance={4} maxDistance={90} maxPolarAngle={Math.PI / 2 - 0.05} />
    </>
  );
}

export default function PreviewPanel() {
  const { projectStructure, isPluginConnected, sendCommand } = useBuilderStore();
  const [showWireframe, setShowWireframe] = useState(false);
  const [cameraResetKey, setCameraResetKey] = useState(0);

  // Default interactive starter world parts
  const [localParts, setLocalParts] = useState([
    {
      Name: 'SpawnLocation',
      ClassName: 'SpawnLocation',
      Properties: { Position: { X: 0, Y: 0.2, Z: 0 }, Size: { X: 4, Y: 0.4, Z: 4 } }
    },
    {
      Name: 'ObbyStage_1',
      ClassName: 'Part',
      Properties: { Position: { X: 0, Y: 1.5, Z: -6 }, Size: { X: 3, Y: 0.8, Z: 3 }, Color: '#e74c3c' }
    },
    {
      Name: 'ObbyStage_2',
      ClassName: 'Part',
      Properties: { Position: { X: 4, Y: 2.5, Z: -10 }, Size: { X: 3, Y: 0.8, Z: 3 }, Color: '#f97316' }
    },
    {
      Name: 'ObbyStage_3',
      ClassName: 'Part',
      Properties: { Position: { X: 0, Y: 3.8, Z: -15 }, Size: { X: 3, Y: 0.8, Z: 3 }, Color: '#38bdf8' }
    },
    {
      Name: 'WinningPlatform',
      ClassName: 'Part',
      Properties: { Position: { X: -4, Y: 5.0, Z: -20 }, Size: { X: 5, Y: 1, Z: 5 }, Color: '#a855f7' }
    }
  ]);

  const handleAddPart = (type: 'Part' | 'Obby' | 'Spawn') => {
    const nextZ = -localParts.length * 4;
    const nextY = localParts.length * 1.2;
    const newPart = {
      Name: `${type}_${localParts.length + 1}`,
      ClassName: type === 'Spawn' ? 'SpawnLocation' : 'Part',
      Properties: {
        Position: { X: Math.sin(localParts.length) * 4, Y: nextY, Z: nextZ },
        Size: { X: 3, Y: 0.8, Z: 3 },
        Color: type === 'Obby' ? '#38bdf8' : '#e74c3c'
      }
    };

    setLocalParts([...localParts, newPart]);

    if (isPluginConnected) {
      sendCommand({
        type: 'createPart',
        target: 'Workspace',
        data: newPart
      });
    }
  };

  const handleResetCamera = () => {
    setCameraResetKey((prev) => prev + 1);
  };

  const entityCount = projectStructure?.instances?.length || localParts.length;

  return (
    <div className="h-full flex flex-col bg-slate-950 select-none overflow-hidden relative">
      {/* Top Header Bar */}
      <div className="h-10 bg-slate-900 border-b border-white/10 flex items-center justify-between px-3 z-10">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-roblox-red/20 text-roblox-red">
            <CubeIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white tracking-wide">3D Viewport</span>
          <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full font-mono">
            {entityCount} Objects
          </span>
        </div>

        {/* Quick View Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowWireframe(!showWireframe)}
            title="Toggle Wireframe Mode"
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
              showWireframe ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Wireframe</span>
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset 3D Camera"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Body */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Canvas 
          key={cameraResetKey}
          camera={{ position: [14, 16, 20], fov: 50 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <Scene showWireframe={showWireframe} localParts={localParts} />
        </Canvas>

        {/* Floating Quick Action Toolbar (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl shadow-2xl z-10">
          <button
            onClick={() => handleAddPart('Part')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all hover:scale-105 border border-white/5"
          >
            <Plus className="w-3.5 h-3.5 text-roblox-red" />
            <span>+ Part</span>
          </button>

          <button
            onClick={() => handleAddPart('Obby')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all hover:scale-105 border border-white/5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Obby Platform</span>
          </button>

          <button
            onClick={() => handleAddPart('Spawn')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all hover:scale-105 border border-white/5"
          >
            <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Spawn Pad</span>
          </button>
        </div>

        {/* Floating Connection Status Badge (Top-Right) */}
        <div className="absolute top-3 right-3 pointer-events-none z-10">
          <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-medium text-slate-300 shadow-lg">
            <span className={`w-2 h-2 rounded-full ${isPluginConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isPluginConnected ? 'Live Studio Sync Active' : 'Interactive 3D Baseplate'}</span>
          </div>
        </div>

        {/* Orbit Hint (Bottom-Right) */}
        <div className="absolute bottom-4 right-4 pointer-events-none z-10 hidden sm:flex items-center space-x-1.5 text-[10px] text-slate-500 bg-slate-950/60 px-2.5 py-1 rounded-full border border-white/5">
          <Camera className="w-3 h-3" />
          <span>Left-Click Rotate • Right-Click Pan • Scroll Zoom</span>
        </div>
      </div>
    </div>
  );
}
