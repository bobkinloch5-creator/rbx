import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Cylinder } from '@react-three/drei';
import { useBuilderStore } from '../../hooks/useBuilderStore';
import { Box as CubeIcon } from 'lucide-react';

function Scene() {
  const { projectStructure } = useBuilderStore();

  // Render basic shapes based on project structure
  const renderInstances = () => {
    if (!projectStructure?.instances) return null;

    return projectStructure.instances.map((instance, idx) => {
      const props = instance.Properties || {};
      const position: [number, number, number] = [
        props.Position?.X || idx * 2,
        props.Position?.Y || 0,
        props.Position?.Z || 0
      ];
      const size = props.Size || { X: 1, Y: 1, Z: 1 };

      switch (instance.ClassName) {
        case 'Part':
          return (
            <Box
              key={idx}
              position={position}
              args={[size.X, size.Y, size.Z]}
            >
              <meshStandardMaterial color="#4a5568" />
            </Box>
          );
        case 'SpawnLocation':
          return (
            <Cylinder
              key={idx}
              position={position}
              args={[1, 1, 0.5, 32]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial color="#48bb78" />
            </Cylinder>
          );
        case 'Model':
          return (
            <group key={idx} position={position}>
              <Box args={[1, 1, 1]}>
                <meshStandardMaterial color="#ed8936" wireframe />
              </Box>
            </group>
          );
        default:
          return null;
      }
    });
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Grid
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#393b3d"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#4a5568"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
      />
      {renderInstances()}
      <OrbitControls makeDefault />
    </>
  );
}

export default function PreviewPanel() {
  const { projectStructure } = useBuilderStore();

  return (
    <div className="h-full flex flex-col bg-roblox-dark">
      <div className="panel-header flex items-center space-x-2">
        <CubeIcon className="w-4 h-4" />
        <span>3D Preview</span>
      </div>

      <div className="flex-1 relative">
        {projectStructure ? (
          <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
            <Scene />
          </Canvas>
        ) : (
          <div className="h-full flex items-center justify-center text-roblox-light">
            <div className="text-center">
              <CubeIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Connect plugin to view your game</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
