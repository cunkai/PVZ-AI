
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd'; 
import { HTML5Backend } from 'react-dnd-html5-backend'; 

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
  GAME_TICK_MS,
  ZOMBIE_SPAWN_INTERVAL_START,
  ZOMBIE_SPAWN_INTERVAL_MIN,
  ZOMBIE_WAVES,
  PROJECTILE_SPEED,
  ZOMBIE_ATTACK_RANGE,
  CELL_SIZE
} from '@/config/gameConfig';
import type { PlantInstance, ZombieInstance, PlantName, ZombieName, GameState, ProjectileInstance } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";


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
  const { toast } = useToast();

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
    initializeGame();
  }, [initializeGame]);


  const handlePlantSelection = (plantName: PlantName) => {
    setSelectedPlantName(prev => prev === plantName ? null : plantName);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!selectedPlantName || gameState !== 'Playing') return;

    const plantData = PLANTS_DATA[selectedPlantName];
    if (sunlight < plantData.cost) {
      toast({ title: "提示", description: "阳光不足！", variant: "destructive" });
      return;
    }

    if (plants.some(p => p.x === col && p.y === row)) {
      toast({ title: "提示", description: "单元格已被占据！", variant: "destructive" });
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
    setSelectedPlantName(null); 
  };

  useEffect(() => {
    if (gameState !== 'Playing') return;

    const gameInterval = setInterval(() => {
      gameTimeRef.current += GAME_TICK_MS;
      const currentTime = gameTimeRef.current;

      setPlants(prevPlants => 
        prevPlants.map(p => {
          if (p.type === '太阳花') {
            const plantData = PLANTS_DATA['太阳花'];
            if (plantData.sunInterval && plantData.sunProduction && currentTime - (p.lastActionTime || 0) >= plantData.sunInterval) {
              setSunlight(s => s + plantData.sunProduction!);
              return { ...p, lastActionTime: currentTime };
            }
          }
          return p;
        })
      );
      
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
              x: GRID_COLS - 0.5, 
              y: randomLane,
              health: zombieTypeData.health,
              lastAttackTime: 0,
            },
          ]);
          setZombiesSpawnedThisWave(s => s + 1);
          lastSpawnTimeRef.current = currentTime;
        }
      }

      setPlants(prevPlants => {
        const newProjectiles: ProjectileInstance[] = [];
        const updatedPlants = prevPlants.map(plant => {
          const plantData = PLANTS_DATA[plant.type];
          if (plantData.damage && plantData.attackSpeed) { 
            const attackIntervalMs = 1000 / plantData.attackSpeed;
            if (currentTime - (plant.lastActionTime || 0) >= attackIntervalMs) {
              const targetableZombiesInLane = zombies.filter(z => z.y === plant.y && z.x < GRID_COLS && z.x > plant.x - 0.5);
              if (targetableZombiesInLane.length > 0) {
                const closestZombie = targetableZombiesInLane.sort((a,b) => a.x - b.x)[0];
                if (closestZombie) {
                   newProjectiles.push({
                    id: generateId(),
                    plantType: plant.type,
                    x: plant.x + 0.7, 
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

      setZombies(prevZombies => 
        prevZombies.map(zombie => {
          const zombieData = ZOMBIES_DATA[zombie.type];
          let newX = zombie.x;
          let updatedZombie = { ...zombie };

          const plantInFront = plants.find(p => p.y === zombie.y && Math.abs(p.x - zombie.x) < ZOMBIE_ATTACK_RANGE + 0.5 && p.x < zombie.x);

          if (plantInFront) { 
            const attackIntervalMs = 1000 / zombieData.attackSpeed;
            if (currentTime - (zombie.lastAttackTime || 0) >= attackIntervalMs) {
              setPlants(prevPs => prevPs.map(p => 
                p.id === plantInFront.id ? { ...p, health: Math.max(0, p.health - zombieData.damage) } : p
              ).filter(p => p.health > 0));
              updatedZombie.lastAttackTime = currentTime;
            }
          } else { 
            newX -= zombieData.speed * (GAME_TICK_MS / 1000);
          }
          
          updatedZombie.x = newX;
          return updatedZombie;
        }).filter(z => z.health > 0) 
      );
      
      setProjectiles(prevProjectiles => {
        const stillActiveProjectiles: ProjectileInstance[] = [];
        prevProjectiles.forEach(proj => {
          let newProjX = proj.x + PROJECTILE_SPEED * (GAME_TICK_MS / 1000);
          let hitZombie = false;

          const zombiesInLane = zombies.filter(z => z.y === proj.lane);
          for (const zombie of zombiesInLane) {
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

      if (zombies.some(z => z.x <= 0)) {
        setGameState('Lost');
        return;
      }

      if (currentWaveIndex >= ZOMBIE_WAVES.length -1 && zombiesSpawnedThisWave >= zombiesToSpawnThisWave && zombies.length === 0) {
        setGameState('Won');
        return;
      }
      
      if (currentWaveIndex < ZOMBIE_WAVES.length -1 && zombiesSpawnedThisWave >= zombiesToSpawnThisWave && zombies.length === 0) {
        const nextWaveIndex = currentWaveIndex + 1;
        setCurrentWaveIndex(nextWaveIndex);
        setZombiesToSpawnThisWave(ZOMBIE_WAVES[nextWaveIndex].count);
        setZombiesSpawnedThisWave(0);
        lastSpawnTimeRef.current = currentTime + (ZOMBIE_WAVES[nextWaveIndex].delay || 0); 
      }

    }, GAME_TICK_MS);

    return () => clearInterval(gameInterval);
  }, [gameState, currentWaveIndex, zombies, plants, zombiesSpawnedThisWave, zombiesToSpawnThisWave, toast]);


  const handleTogglePause = () => {
    if (gameState === 'Playing') setGameState('Paused');
    else if (gameState === 'Paused') setGameState('Playing');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4 bg-gradient-to-br from-green-100 to-lime-100 dark:from-gray-800 dark:to-green-900">
        <header className="w-full max-w-4xl mb-4 flex justify-between items-center p-2 rounded-lg bg-primary/10 shadow">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">僵尸大战植物</h1>
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
                <p className="text-xl text-gray-500">战场加载中...</p>
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
          <p>一个简单的植物大战僵尸演示游戏。祝你玩得开心！</p>
          <p>提示：太阳花生产阳光。豌豆射手发射豌豆。请明智地放置！</p>
        </footer>
      </div>
    </DndProvider>
  );
}
