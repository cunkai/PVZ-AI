"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd'; // Placeholder for future drag-and-drop
import { HTML5Backend } from 'react-dnd-html5-backend'; // Placeholder

import BattlefieldGrid from '@/components/game/BattlefieldGrid';
import PlantSelectionPanel from '@/components/game/PlantSelectionPanel';
import SunlightDisplay from '@/components/game/SunlightDisplay';
import GameStatusDisplay from '@/components/game/GameStatusDisplay';
import { Button } from '@/components/ui/button';
import {
  PLANTS_DATA,
  ZOMBIES_DATA,
  GRID_ROWS,
  GRID_COLS,
  INITIAL_SUNLIGHT,
  SUNFLOWER_PRODUCTION_INTERVAL,
  SUNFLOWER_SUN_AMOUNT,
  GAME_TICK_MS,
  ZOMBIE_SPAWN_INTERVAL_START,
  ZOMBIE_SPAWN_INTERVAL_MIN,
  ZOMBIE_WAVES,
  PROJECTILE_SPEED,
  ZOMBIE_ATTACK_RANGE,
  CELL_SIZE
} from '@/config/gameConfig';
import type { PlantInstance, ZombieInstance, PlantName, ZombieName, GameState, ProjectileInstance } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs. Install with `npm install uuid @types/uuid`

// Helper function to generate unique IDs
// If uuid is not available, use a simpler one for demo
const generateId = () => typeof uuidv4 === 'function' ? uuidv4() : Math.random().toString(36).substring(2, 15);


export default function HomePage() {
  const [sunlight, setSunlight] = useState(INITIAL_SUNLIGHT);
  const [plants, setPlants] = useState<PlantInstance[]>([]);
  const [zombies, setZombies] = useState<ZombieInstance[]>([]);
  const [projectiles, setProjectiles] = useState<ProjectileInstance[]>([]);
  const [selectedPlantName, setSelectedPlantName] = useState<PlantName | null>(null);
  const [gameState, setGameState] = useState<GameState>('Initializing');
  const [currentWaveIndex, setCurrentWaveIndex] = useState(0);
  const [zombiesToSpawnThisWave, setZombiesToSpawnThisWave] = useState(0);
  const [zombiesSpawnedThisWave, setZombiesSpawnedThisWave] = useState(0);
  
  const lastSpawnTimeRef = useRef(0);
  const gameTimeRef = useRef(0);

  const initializeGame = useCallback(() => {
    setSunlight(INITIAL_SUNLIGHT);
    setPlants([]);
    setZombies([]);
    setProjectiles([]);
    setSelectedPlantName(null);
    setCurrentWaveIndex(0);
    setZombiesToSpawnThisWave(ZOMBIE_WAVES[0].count);
    setZombiesSpawnedThisWave(0);
    lastSpawnTimeRef.current = 0;
    gameTimeRef.current = 0;
    setGameState('Playing');
  }, []);

  useEffect(() => {
    // Initialize game on mount
    initializeGame();
  }, [initializeGame]);


  const handlePlantSelection = (plantName: PlantName) => {
    setSelectedPlantName(prev => prev === plantName ? null : plantName);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!selectedPlantName || gameState !== 'Playing') return;

    const plantData = PLANTS_DATA[selectedPlantName];
    if (sunlight < plantData.cost) {
      alert("Not enough sunlight!"); // Replace with a nicer toast/notification
      return;
    }

    // Check if cell is occupied
    if (plants.some(p => p.x === col && p.y === row)) {
      alert("Cell is already occupied!");
      return;
    }

    setSunlight(s => s - plantData.cost);
    setPlants(prevPlants => [
      ...prevPlants,
      {
        id: generateId(),
        type: selectedPlantName,
        x: col,
        y: row,
        health: plantData.health,
        lastActionTime: gameTimeRef.current,
      },
    ]);
    setSelectedPlantName(null); // Deselect after planting
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'Playing') return;

    const gameInterval = setInterval(() => {
      gameTimeRef.current += GAME_TICK_MS;
      const currentTime = gameTimeRef.current;

      // 1. Sunlight generation from Sunflowers
      setPlants(prevPlants => 
        prevPlants.map(p => {
          if (p.type === 'Sunflower') {
            const plantData = PLANTS_DATA.Sunflower;
            if (plantData.sunInterval && plantData.sunProduction && currentTime - (p.lastActionTime || 0) >= plantData.sunInterval) {
              setSunlight(s => s + plantData.sunProduction!);
              return { ...p, lastActionTime: currentTime };
            }
          }
          return p;
        })
      );
      
      // 2. Zombie Spawning
      if (currentWaveIndex < ZOMBIE_WAVES.length) {
        const waveData = ZOMBIE_WAVES[currentWaveIndex];
        const spawnInterval = Math.max(ZOMBIE_SPAWN_INTERVAL_MIN, ZOMBIE_SPAWN_INTERVAL_START - (currentWaveIndex * 1000));
        
        if (zombiesSpawnedThisWave < zombiesToSpawnThisWave && currentTime - lastSpawnTimeRef.current >= spawnInterval) {
          const randomLane = Math.floor(Math.random() * GRID_ROWS);
          const zombieTypeData = waveData.types[Math.floor(Math.random() * waveData.types.length)];
          
          setZombies(prevZombies => [
            ...prevZombies,
            {
              id: generateId(),
              type: zombieTypeData.name,
              x: GRID_COLS - 0.5, // Start just off screen
              y: randomLane,
              health: zombieTypeData.health,
              lastAttackTime: 0,
            },
          ]);
          setZombiesSpawnedThisWave(s => s + 1);
          lastSpawnTimeRef.current = currentTime;
        }
      }

      // 3. Plant Actions (Shooting)
      setPlants(prevPlants => {
        const newProjectiles: ProjectileInstance[] = [];
        const updatedPlants = prevPlants.map(plant => {
          const plantData = PLANTS_DATA[plant.type];
          if (plantData.damage && plantData.attackSpeed) { // It's an attacker
            const attackIntervalMs = 1000 / plantData.attackSpeed;
            if (currentTime - (plant.lastActionTime || 0) >= attackIntervalMs) {
              // Find target zombie in lane
              const targetableZombiesInLane = zombies.filter(z => z.y === plant.y && z.x < GRID_COLS && z.x > plant.x - 0.5); // target zombies in front
              if (targetableZombiesInLane.length > 0) {
                 // Simplistic targeting: first zombie in lane
                const closestZombie = targetableZombiesInLane.sort((a,b) => a.x - b.x)[0];
                if (closestZombie) {
                   newProjectiles.push({
                    id: generateId(),
                    plantType: plant.type,
                    x: plant.x + 0.7, // Emerge from front of plant
                    y: plant.y,
                    damage: plantData.damage,
                    lane: plant.y,
                  });
                  return { ...plant, lastActionTime: currentTime };
                }
              }
            }
          }
          return plant;
        });
        if (newProjectiles.length > 0) {
          setProjectiles(prev => [...prev, ...newProjectiles]);
        }
        return updatedPlants;
      });


      // 4. Zombie Movement & Attack
      setZombies(prevZombies => 
        prevZombies.map(zombie => {
          const zombieData = ZOMBIES_DATA[zombie.type];
          let newX = zombie.x;
          let updatedZombie = { ...zombie };

          // Check for plant in front
          const plantInFront = plants.find(p => p.y === zombie.y && Math.abs(p.x - zombie.x) < ZOMBIE_ATTACK_RANGE + 0.5 && p.x < zombie.x);

          if (plantInFront) { // Attack plant
            const attackIntervalMs = 1000 / zombieData.attackSpeed;
            if (currentTime - (zombie.lastAttackTime || 0) >= attackIntervalMs) {
              setPlants(prevPs => prevPs.map(p => 
                p.id === plantInFront.id ? { ...p, health: Math.max(0, p.health - zombieData.damage) } : p
              ).filter(p => p.health > 0));
              updatedZombie.lastAttackTime = currentTime;
            }
          } else { // Move
            newX -= zombieData.speed * (GAME_TICK_MS / 1000);
          }
          
          updatedZombie.x = newX;
          return updatedZombie;
        }).filter(z => z.health > 0) // Remove dead zombies
      );
      
      // 5. Projectile Movement & Collision
      setProjectiles(prevProjectiles => {
        const stillActiveProjectiles: ProjectileInstance[] = [];
        prevProjectiles.forEach(proj => {
          let newProjX = proj.x + PROJECTILE_SPEED * (GAME_TICK_MS / 1000);
          let hitZombie = false;

          // Check for collision
          const zombiesInLane = zombies.filter(z => z.y === proj.lane);
          for (const zombie of zombiesInLane) {
            // Simple collision check (projectile center vs zombie bounding box)
            if (newProjX > zombie.x && newProjX < zombie.x + 0.8 && Math.abs(proj.y - zombie.y) < 0.5) {
               setZombies(prevZ => prevZ.map(zInstance => 
                zInstance.id === zombie.id ? { ...zInstance, health: Math.max(0, zInstance.health - proj.damage) } : zInstance
              ).filter(z => z.health > 0));
              hitZombie = true;
              break; 
            }
          }

          if (!hitZombie && newProjX < GRID_COLS) {
            stillActiveProjectiles.push({ ...proj, x: newProjX });
          }
        });
        return stillActiveProjectiles;
      });

      // 6. Check Win/Loss Conditions
      // Loss: Zombie reaches leftmost column
      if (zombies.some(z => z.x <= 0)) {
        setGameState('Lost');
        return;
      }

      // Win: All waves cleared and no zombies left
      if (currentWaveIndex >= ZOMBIE_WAVES.length -1 && zombiesSpawnedThisWave >= zombiesToSpawnThisWave && zombies.length === 0) {
        setGameState('Won');
        return;
      }
      
      // Advance to next wave
      if (currentWaveIndex < ZOMBIE_WAVES.length -1 && zombiesSpawnedThisWave >= zombiesToSpawnThisWave && zombies.length === 0) {
        setCurrentWaveIndex(prev => prev + 1);
        setZombiesToSpawnThisWave(ZOMBIE_WAVES[currentWaveIndex + 1].count);
        setZombiesSpawnedThisWave(0);
        lastSpawnTimeRef.current = currentTime + (ZOMBIE_WAVES[currentWaveIndex + 1].delay || 0); // Apply delay for next wave
      }

    }, GAME_TICK_MS);

    return () => clearInterval(gameInterval);
  }, [gameState, currentWaveIndex, zombies, plants, zombiesSpawnedThisWave, zombiesToSpawnThisWave]);


  const handleTogglePause = () => {
    if (gameState === 'Playing') setGameState('Paused');
    else if (gameState === 'Paused') setGameState('Playing');
  };

  return (
    <DndProvider backend={HTML5Backend}> {/* Placeholder DND provider */}
      <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4 bg-gradient-to-br from-green-100 to-lime-100 dark:from-gray-800 dark:to-green-900">
        <header className="w-full max-w-4xl mb-4 flex justify-between items-center p-2 rounded-lg bg-primary/10 shadow">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Zombies vs. Sprouts</h1>
          <SunlightDisplay sunlight={sunlight} />
        </header>

        <main className="flex flex-col md:flex-row gap-4 w-full max-w-6xl items-start">
          <div className="flex-shrink-0 md:order-2">
            <PlantSelectionPanel
              plantsData={PLANTS_DATA}
              onSelectPlant={handlePlantSelection}
              selectedPlantName={selectedPlantName}
              currentSunlight={sunlight}
            />
          </div>
          <div className="flex-grow flex justify-center md:order-1">
            {gameState !== 'Initializing' ? (
              <BattlefieldGrid
                plants={plants}
                zombies={zombies}
                projectiles={projectiles}
                onCellClick={handleCellClick}
                selectedPlantName={selectedPlantName}
              />
            ) : (
              <div style={{ width: GRID_COLS * CELL_SIZE, height: GRID_ROWS * CELL_SIZE }} className="flex items-center justify-center bg-gray-200 rounded-lg border-4 border-yellow-600">
                <p className="text-xl text-gray-500">Loading Battlefield...</p>
              </div>
            )}
          </div>
        </main>
        
        <GameStatusDisplay 
          gameState={gameState} 
          currentWave={currentWaveIndex}
          totalWaves={ZOMBIE_WAVES.length}
          onRestart={initializeGame}
          onTogglePause={handleTogglePause}
          isPaused={gameState === 'Paused'}
        />

        <footer className="mt-6 text-center text-sm text-muted-foreground">
          <p>A simple Plants vs. Zombies demo. Enjoy!</p>
          <p>Tip: Sunflowers generate sun. Peashooters shoot. Place wisely!</p>
        </footer>
      </div>
    </DndProvider>
  );
}
