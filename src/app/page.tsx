
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

const DEATH_ANIMATION_DURATION = 500; // ms, matches unitDieEffect in globals.css
const PLANT_ATTACK_ANIMATION_DURATION = 300; // ms
const SUNFLOWER_PRODUCE_ANIMATION_DURATION = 600; // ms
const ZOMBIE_ATTACK_ANIMATION_DURATION = 400; // ms
const ZOMBIE_HIT_ANIMATION_DURATION = 200; // ms

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
  const waveToastShownRef = useRef(false); // Ref to track if wave start toast has been shown

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
    waveToastShownRef.current = false;
    setGameState('Playing');
    toast({
      title: "战斗开始！",
      description: `第 1 波僵尸正在逼近！准备部署你的植物！`,
      duration: 4000,
    });
  }, [toast]);

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
      toast({ title: "阳光不足", description: "你需要更多阳光才能种植这种植物！", variant: "destructive" });
      return;
    }

    if (plants.some(p => p.x === col && p.y === row)) {
      toast({ title: "无法种植", description: "这个单元格已经被其他植物占据了！", variant: "destructive" });
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

      // Sunlight production
      setPlants(prevPlants => 
        prevPlants.map(p => {
          if (p.type === '太阳花' || p.type === '双子向日葵') {
            const plantData = PLANTS_DATA[p.type];
            if (plantData.sunInterval && plantData.sunProduction && currentTime - (p.lastActionTime || 0) >= plantData.sunInterval) {
              setSunlight(s => s + plantData.sunProduction!);
              const plantId = p.id;
              setTimeout(() => {
                setPlants(prev => prev.map(plant => plant.id === plantId ? { ...plant, isProducingSun: false } : plant));
              }, SUNFLOWER_PRODUCE_ANIMATION_DURATION);
              return { ...p, lastActionTime: currentTime, isProducingSun: true };
            }
          }
          return p;
        })
      );
      
      // Zombie Spawning
      if (currentWaveIndex < ZOMBIE_WAVES.length) {
        const waveData = ZOMBIE_WAVES[currentWaveIndex];
         const baseInterval = Math.max(ZOMBIE_SPAWN_INTERVAL_MIN, ZOMBIE_SPAWN_INTERVAL_START - (currentWaveIndex * 500)); // Slower interval reduction per wave
         const actualSpawnInterval = baseInterval * (0.85 + Math.random() * 0.3); // +/- 15% jitter
        
        if (zombiesSpawnedThisWave < zombiesToSpawnThisWave && currentTime - lastSpawnTimeRef.current >= actualSpawnInterval) {
          const randomLane = Math.floor(Math.random() * GRID_ROWS);
          // Ensure waveData.types exists and has elements
          const zombieTypeData = waveData.types && waveData.types.length > 0 
            ? waveData.types[Math.floor(Math.random() * waveData.types.length)] 
            : ZOMBIES_DATA.普通僵尸; // Fallback to basic zombie if types is undefined/empty
          
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

      // Plant attacks (Shooting projectiles)
      setPlants(prevPlants => {
        const newProjectiles: ProjectileInstance[] = [];
        const updatedPlants = prevPlants.map(plant => {
          if (plant.isDying) return plant; 

          const plantData = PLANTS_DATA[plant.type];
          if (plantData.damage && plantData.attackSpeed) { 
            const attackIntervalMs = 1000 / plantData.attackSpeed;
            if (currentTime - (plant.lastActionTime || 0) >= attackIntervalMs) {
              const targetableZombiesInLane = zombies.filter(z => !z.isDying && z.y === plant.y && z.x < GRID_COLS && z.x > plant.x - 0.5);
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
                  const plantId = plant.id;
                  setTimeout(() => {
                    setPlants(prev => prev.map(p => p.id === plantId ? { ...p, isAttacking: false } : p));
                  }, PLANT_ATTACK_ANIMATION_DURATION);
                  return { ...plant, lastActionTime: currentTime, isAttacking: true };
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

      // Zombie movement and attacks
      setZombies(prevZombies => 
        prevZombies.map(zombie => {
          if (zombie.isDying) return zombie;

          const zombieData = ZOMBIES_DATA[zombie.type];
          let newX = zombie.x;
          let updatedZombie = { ...zombie };

          const plantInFront = plants.find(p => !p.isDying && p.y === zombie.y && Math.abs(p.x - zombie.x) < ZOMBIE_ATTACK_RANGE + 0.5 && p.x < zombie.x);

          if (plantInFront) { 
            const attackIntervalMs = 1000 / zombieData.attackSpeed;
            if (currentTime - (zombie.lastAttackTime || 0) >= attackIntervalMs) {
              setPlants(prevPs => prevPs.map(p => {
                if (p.id === plantInFront.id && !p.isDying) {
                  const newPlantHealth = Math.max(0, p.health - zombieData.damage);
                  if (newPlantHealth <= 0 && !p.isDying) {
                    return { ...p, health: 0, isDying: true, timeOfDeath: currentTime };
                  }
                  return { ...p, health: newPlantHealth };
                }
                return p;
              }));
              updatedZombie.lastAttackTime = currentTime;
              updatedZombie.isAttacking = true;
              const zombieId = zombie.id;
              setTimeout(() => {
                setZombies(prev => prev.map(z => z.id === zombieId ? { ...z, isAttacking: false } : z));
              }, ZOMBIE_ATTACK_ANIMATION_DURATION);
            }
          } else { 
            newX -= zombieData.speed * (GAME_TICK_MS / 1000);
          }
          
          updatedZombie.x = newX;
          return updatedZombie;
        })
      );
      
      // Projectile movement and collision
      setProjectiles(prevProjectiles => {
        const stillActiveProjectiles: ProjectileInstance[] = [];
        prevProjectiles.forEach(proj => {
          let newProjX = proj.x + PROJECTILE_SPEED * (GAME_TICK_MS / 1000);
          let hitZombie = false;

          const zombiesInLane = zombies.filter(z => !z.isDying && z.y === proj.lane);
          for (const zombieTarget of zombiesInLane) {
            if (newProjX > zombieTarget.x && newProjX < zombieTarget.x + 0.8 && Math.abs(proj.y - zombieTarget.y) < 0.5) {
               setZombies(prevZ => prevZ.map(zInstance => {
                if (zInstance.id === zombieTarget.id && !zInstance.isDying) {
                  const newZombieHealth = Math.max(0, zInstance.health - proj.damage);
                  const zombieId = zInstance.id;
                  setTimeout(() => {
                    setZombies(prev => prev.map(z => z.id === zombieId ? { ...z, isHit: false } : z));
                  }, ZOMBIE_HIT_ANIMATION_DURATION);
                  
                  if (newZombieHealth <= 0 && !zInstance.isDying) {
                    return { ...zInstance, health: 0, isHit: true, isDying: true, timeOfDeath: currentTime };
                  }
                  return { ...zInstance, health: newZombieHealth, isHit: true };
                }
                return zInstance;
              }));
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

      // Filter out dead units after animation
      setPlants(currentPlants => currentPlants.filter(p => 
          !(p.isDying && p.timeOfDeath && currentTime >= (p.timeOfDeath + DEATH_ANIMATION_DURATION))
      ));
      setZombies(currentZombies => currentZombies.filter(z => 
          !(z.isDying && z.timeOfDeath && currentTime >= (z.timeOfDeath + DEATH_ANIMATION_DURATION))
      ));

      // Game state checks (Win/Loss)
      if (zombies.some(z => !z.isDying && z.x <= 0)) {
        setGameState('Lost');
        return;
      }

      const activeZombies = zombies.filter(z => !z.isDying);
      if (currentWaveIndex >= ZOMBIE_WAVES.length -1 && zombiesSpawnedThisWave >= zombiesToSpawnThisWave && activeZombies.length === 0) {
        setGameState('Won');
        return;
      }
      
      // Next wave logic
      if (currentWaveIndex < ZOMBIE_WAVES.length -1 && zombiesSpawnedThisWave >= zombiesToSpawnThisWave && activeZombies.length === 0) {
        const nextWaveIndex = currentWaveIndex + 1;
        setCurrentWaveIndex(nextWaveIndex);
        setZombiesToSpawnThisWave(ZOMBIE_WAVES[nextWaveIndex].count);
        setZombiesSpawnedThisWave(0);
        lastSpawnTimeRef.current = currentTime + (ZOMBIE_WAVES[nextWaveIndex].delay || 0); 
        waveToastShownRef.current = false; // Reset for next wave
      }

      // Show wave start toast
      if (!waveToastShownRef.current && gameState === 'Playing' && zombiesSpawnedThisWave === 0) {
         if (currentWaveIndex > 0 || (currentWaveIndex === 0 && gameTimeRef.current > GAME_TICK_MS) ) { // Avoid double toast on init
            toast({
              title: `第 ${currentWaveIndex + 1} 波进攻！`,
              description: `僵尸大军正在集结！准备迎战！`,
              duration: 3000,
            });
            waveToastShownRef.current = true;
         }
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
      <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4 bg-gradient-to-br from-green-200 via-lime-200 to-emerald-200 dark:from-gray-800 dark:via-green-900 dark:to-teal-900">
        <header className="w-full max-w-4xl mb-4 flex justify-between items-center p-2 rounded-lg bg-primary/20 shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary drop-shadow-sm">僵尸大战植物</h1>
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
              <div style={{ width: GRID_COLS * CELL_SIZE, height: GRID_ROWS * CELL_SIZE }} className="flex items-center justify-center bg-gray-200/70 rounded-lg border-4 border-yellow-600 shadow-lg">
                <p className="text-xl text-gray-500">战场加载中，请稍候...</p>
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

        <footer className="mt-6 text-center text-xs sm:text-sm text-muted-foreground/80">
          <p>勇敢的指挥官，你的花园正面临前所未有的威胁！运用你的智慧，合理部署植物，抵御一波又一波的僵尸入侵吧！</p>
          <p>小提示：太阳花是你的经济命脉，豌豆射手是可靠的伙伴。坚果墙能为你争取宝贵时间！</p>
        </footer>
      </div>
    </DndProvider>
  );
}
