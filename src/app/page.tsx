
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd'; 
import { HTML5Backend } from 'react-dnd-html5-backend'; 
import { Shovel } from 'lucide-react';

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
  CELL_SIZE,
} from '@/config/gameConfig';
import type { PlantInstance, ZombieInstance, PlantName, ZombieName, GameState, ProjectileInstance, PlantData, MinerZombieState } from '@/types';
import * as uuid from 'uuid'; // Changed import
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const DEATH_ANIMATION_DURATION = 500; 
const PLANT_ATTACK_ANIMATION_DURATION = 300; 
const SUNFLOWER_PRODUCE_ANIMATION_DURATION = 600; 
const ZOMBIE_ATTACK_ANIMATION_DURATION = 400; 
const ZOMBIE_HIT_ANIMATION_DURATION = 200; 
const MINER_DIG_EMERGE_ANIMATION_DURATION = 300;

// Updated generateId function
const generateId = () => {
  if (uuid && typeof uuid.v4 === 'function') {
    try {
      return uuid.v4();
    } catch (e) {
      console.error("uuid.v4() call failed, falling back to Math.random:", e);
      // Fallback if uuid.v4() is available but throws an error during execution
      return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    }
  }
  // Fallback if uuid or uuid.v4 is not available as expected
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
};


const ALL_PLANTS_SORTED = Object.values(PLANTS_DATA).sort((a, b) => a.cost - b.cost);

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
  const [isShovelModeActive, setIsShovelModeActive] = useState(false);
  
  const lastSpawnTimeRef = useRef(0);
  const gameTimeRef = useRef(0);
  const { toast } = useToast();
  const waveToastShownRef = useRef(false); 

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
    setIsShovelModeActive(false);
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
    if (isShovelModeActive) setIsShovelModeActive(false); 
    setSelectedPlantName(prev => prev === plantName ? null : plantName);
  };

  const handleToggleShovelMode = () => {
    setSelectedPlantName(null); 
    setIsShovelModeActive(prev => !prev);
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== 'Playing') return;

    if (isShovelModeActive) {
      const plantToRemoveIndex = plants.findIndex(p => p.x === col && p.y === row && !p.isDying);
      if (plantToRemoveIndex !== -1) {
        const plantIdToRemove = plants[plantToRemoveIndex].id;
        setPlants(prevPlants => prevPlants.map(p => {
          if (p.id === plantIdToRemove) {
            return { ...p, health: 0, isDying: true, timeOfDeath: gameTimeRef.current }; 
          }
          return p;
        }));
        toast({ title: "植物已移除", description: "你成功使用了铲子！" });
        setIsShovelModeActive(false); 
      } else {
        toast({ title: "操作无效", description: "这里没有植物可以移除。", variant: "destructive" });
      }
      return;
    }

    if (!selectedPlantName) return;

    const plantData = PLANTS_DATA[selectedPlantName];
    if (sunlight < plantData.cost) {
      toast({ title: "阳光不足", description: "你需要更多阳光才能种植这种植物！", variant: "destructive" });
      return;
    }

    if (plants.some(p => p.x === col && p.y === row && !p.isDying)) {
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

      setPlants(prevPlants => 
        prevPlants.map(p => {
          if (p.isDying) return p;
          const plantData = PLANTS_DATA[p.type];
          if (plantData.sunProduction && plantData.sunProduction > 0) {
            if (plantData.sunInterval && currentTime - (p.lastActionTime || 0) >= plantData.sunInterval) {
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
      
      if (currentWaveIndex < ZOMBIE_WAVES.length) {
        const waveData = ZOMBIE_WAVES[currentWaveIndex];
         const baseInterval = Math.max(ZOMBIE_SPAWN_INTERVAL_MIN, ZOMBIE_SPAWN_INTERVAL_START - (currentWaveIndex * 300));
         const actualSpawnInterval = baseInterval * (0.85 + Math.random() * 0.3); 
        
        if (zombiesSpawnedThisWave < zombiesToSpawnThisWave && currentTime - lastSpawnTimeRef.current >= actualSpawnInterval) {
          const randomLane = Math.floor(Math.random() * GRID_ROWS);
          const zombieTypeData = waveData.types && waveData.types.length > 0 
            ? waveData.types[Math.floor(Math.random() * waveData.types.length)] 
            : ZOMBIES_DATA.普通僵尸; 
          
          const newZombie: ZombieInstance = {
            id: generateId(),
            type: zombieTypeData.name,
            x: GRID_COLS - 0.1, 
            y: randomLane,
            health: zombieTypeData.health,
            lastAttackTime: 0,
            minerState: zombieTypeData.name === '矿工僵尸' ? 'WALKING' : undefined,
            timeEnteredMinerState: zombieTypeData.name === '矿工僵尸' ? currentTime : undefined,
            originalY: randomLane,
          };

          if (zombieTypeData.name === '报纸僵尸' && zombieTypeData.newspaperHealth) {
            newZombie.currentNewspaperHealth = zombieTypeData.newspaperHealth;
          }
          
          setZombies(prevZombies => [...prevZombies, newZombie]);
          setZombiesSpawnedThisWave(s => s + 1);
          lastSpawnTimeRef.current = currentTime;
        }
      }

      setPlants(prevPlants => {
        const newProjectiles: ProjectileInstance[] = [];
        const updatedPlants = prevPlants.map(plant => {
          if (plant.isDying) return plant; 

          const plantData = PLANTS_DATA[plant.type];
          if (plantData.damage && plantData.attackSpeed) { 
            const attackIntervalMs = 1000 / plantData.attackSpeed;
            if (currentTime - (plant.lastActionTime || 0) >= attackIntervalMs) {
              const targetableZombiesInLane = zombies.filter(z => 
                !z.isDying && 
                z.y === plant.y && 
                z.x < GRID_COLS && 
                z.x > plant.x - 0.5 &&
                z.minerState !== 'UNDERGROUND' && z.minerState !== 'DIGGING'
              );
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
                    startX: plant.x + 0.7,
                  });

                  if (plant.type === '分裂豆') {
                    newProjectiles.push({
                      id: generateId(),
                      plantType: plant.type,
                      x: plant.x - 0.2, 
                      y: plant.y,
                      damage: plantData.damage,
                      lane: plant.y,
                      startX: plant.x - 0.2,
                      isBackward: true,
                    });
                  }

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

      setZombies(prevZombies => 
        prevZombies.map(zombie => {
          if (zombie.isDying) return zombie;

          const zombieData = ZOMBIES_DATA[zombie.type];
          let newX = zombie.x;
          let currentSpeed = zombie.isEnraged && zombieData.enragedSpeed ? zombieData.enragedSpeed : zombieData.speed;
          let updatedZombie = { ...zombie };

          if (zombie.type === '矿工僵尸' && zombieData.canDig) {
            const timeInCurrentState = currentTime - (zombie.timeEnteredMinerState || 0);

            switch (zombie.minerState) {
              case 'WALKING':
                if (zombie.x <= zombieData.digColumnTrigger!) {
                  updatedZombie.minerState = 'PRE_DIGGING';
                  updatedZombie.timeEnteredMinerState = currentTime;
                } else {
                    const plantInFrontStd = plants.find(p => !p.isDying && p.y === zombie.y && Math.abs(p.x - zombie.x) < ZOMBIE_ATTACK_RANGE + 0.5 && p.x < zombie.x);
                    if (!plantInFrontStd) newX -= currentSpeed * (GAME_TICK_MS / 1000);
                }
                break;
              case 'PRE_DIGGING':
                if (timeInCurrentState >= MINER_DIG_EMERGE_ANIMATION_DURATION / 2) {
                    updatedZombie.minerState = 'DIGGING';
                    updatedZombie.timeEnteredMinerState = currentTime;
                }
                break;
              case 'DIGGING':
                if (timeInCurrentState >= zombieData.digDuration!) {
                  updatedZombie.minerState = 'UNDERGROUND';
                  updatedZombie.timeEnteredMinerState = currentTime;
                  updatedZombie.originalY = zombie.y;
                }
                break;
              case 'UNDERGROUND':
                if (timeInCurrentState >= zombieData.undergroundTravelTime!) {
                  updatedZombie.x = zombieData.emergeColumn!; 
                  updatedZombie.minerState = 'EMERGING';
                  updatedZombie.timeEnteredMinerState = currentTime;
                }
                break;
              case 'EMERGING':
                 if (timeInCurrentState >= zombieData.digDuration!) { 
                    updatedZombie.minerState = 'WALKING'; 
                    updatedZombie.timeEnteredMinerState = currentTime;
                 }
                break;
            }
             if (updatedZombie.minerState === 'WALKING' || updatedZombie.minerState === undefined) {
                const plantInFront = plants.find(p => !p.isDying && p.y === zombie.y && Math.abs(p.x - zombie.x) < ZOMBIE_ATTACK_RANGE + 0.5 && (zombie.x > p.x));
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
                } else if (updatedZombie.minerState === 'WALKING' && zombie.x > 0) { 
                    newX += currentSpeed * (GAME_TICK_MS / 1000); 
                    if (newX >= GRID_COLS -1) newX = GRID_COLS -1.01; 
                } else if (updatedZombie.minerState === 'WALKING' && zombie.x <=0) {
                    // Game loss condition handled elsewhere
                }
            }

          } else { 
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
                if (zombie.minerState !== 'DIGGING' && zombie.minerState !== 'PRE_DIGGING' && zombie.minerState !== 'EMERGING' && zombie.minerState !== 'UNDERGROUND') {
                     newX -= currentSpeed * (GAME_TICK_MS / 1000);
                }
            }
          }
          
          updatedZombie.x = newX;
          return updatedZombie;
        })
      );
      
      setProjectiles(prevProjectiles => {
        const stillActiveProjectiles: ProjectileInstance[] = [];
        prevProjectiles.forEach(proj => {
          let newProjX = proj.x + (proj.isBackward ? -PROJECTILE_SPEED : PROJECTILE_SPEED) * (GAME_TICK_MS / 1000);
          let hitZombie = false;

          const zombiesInLane = zombies.filter(z => 
                !z.isDying && 
                z.y === proj.lane &&
                z.minerState !== 'UNDERGROUND' && z.minerState !== 'DIGGING'
            );
          for (const zombieTarget of zombiesInLane) {
            const hitCondition = proj.isBackward 
              ? (newProjX < zombieTarget.x + 0.6 && newProjX > zombieTarget.x - 0.2)
              : (newProjX > zombieTarget.x - 0.2 && newProjX < zombieTarget.x + 0.6); 
            
            if (hitCondition && Math.abs(proj.y - zombieTarget.y) < 0.5) {
               setZombies(prevZ => prevZ.map(zInstance => {
                if (zInstance.id === zombieTarget.id && !zInstance.isDying) {
                  let damageToDeal = proj.damage;
                  let newZombieHealth = zInstance.health;
                  let newNewspaperHealth = zInstance.currentNewspaperHealth;
                  let becameEnraged = false;

                  if (zInstance.type === '报纸僵尸' && zInstance.currentNewspaperHealth && zInstance.currentNewspaperHealth > 0) {
                    newNewspaperHealth = Math.max(0, zInstance.currentNewspaperHealth - damageToDeal);
                    if (newNewspaperHealth <= 0 && !zInstance.isEnraged) {
                       becameEnraged = true;
                    }
                  } else {
                    newZombieHealth = Math.max(0, zInstance.health - damageToDeal);
                  }
                  
                  const zombieId = zInstance.id;
                  setTimeout(() => {
                    setZombies(prev => prev.map(z => z.id === zombieId ? { ...z, isHit: false } : z));
                  }, ZOMBIE_HIT_ANIMATION_DURATION);
                  
                  if (newZombieHealth <= 0 && !zInstance.isDying) {
                    return { ...zInstance, health: 0, isHit: true, isDying: true, timeOfDeath: currentTime, currentNewspaperHealth: 0 };
                  }
                  return { ...zInstance, health: newZombieHealth, currentNewspaperHealth: newNewspaperHealth, isHit: true, isEnraged: zInstance.isEnraged || becameEnraged };
                }
                return zInstance;
              }));
              hitZombie = true;
              break; 
            }
          }

          const isOffScreen = proj.isBackward ? newProjX < -1 : newProjX >= GRID_COLS;
          if (!hitZombie && !isOffScreen) { 
            stillActiveProjectiles.push({ ...proj, x: newProjX });
          }
        });
        return stillActiveProjectiles;
      });

      setPlants(currentPlants => currentPlants.filter(p => 
          !(p.isDying && p.timeOfDeath && currentTime >= (p.timeOfDeath + DEATH_ANIMATION_DURATION))
      ));
      setZombies(currentZombies => currentZombies.filter(z => 
          !(z.isDying && z.timeOfDeath && currentTime >= (z.timeOfDeath + DEATH_ANIMATION_DURATION))
      ));

      if (zombies.some(z => !z.isDying && z.x <= -0.5)) { 
        setGameState('Lost');
        return;
      }

      const activeZombies = zombies.filter(z => !z.isDying && z.minerState !== 'UNDERGROUND');
      if (currentWaveIndex >= ZOMBIE_WAVES.length -1 && zombiesSpawnedThisWave >= zombiesToSpawnThisWave && activeZombies.length === 0) {
        setGameState('Won');
        return;
      }
      
      if (currentWaveIndex < ZOMBIE_WAVES.length -1 && zombiesSpawnedThisWave >= zombiesToSpawnThisWave && activeZombies.length === 0) {
        const nextWaveIndex = currentWaveIndex + 1;
        setCurrentWaveIndex(nextWaveIndex);
        setZombiesToSpawnThisWave(ZOMBIE_WAVES[nextWaveIndex].count);
        setZombiesSpawnedThisWave(0);
        lastSpawnTimeRef.current = currentTime + (ZOMBIE_WAVES[nextWaveIndex].delay || 0); 
        waveToastShownRef.current = false; 
      }

      if (!waveToastShownRef.current && gameState === 'Playing' && zombiesSpawnedThisWave === 0) {
         if (currentWaveIndex > 0 || (currentWaveIndex === 0 && gameTimeRef.current > GAME_TICK_MS) ) { 
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
          <h1 className="text-2xl sm:text-3xl font-bold text-primary drop-shadow-sm">僵尸入侵：家园保卫战！</h1>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleToggleShovelMode} 
              variant={isShovelModeActive ? "destructive" : "secondary"}
              size="icon"
              title="使用铲子移除植物"
              aria-label="切换铲子模式"
            >
              <Shovel className={cn("w-5 h-5", isShovelModeActive && "text-white")} />
            </Button>
            <SunlightDisplay sunlight={sunlight} />
          </div>
        </header>

        <main className="flex flex-col md:flex-row gap-4 w-full max-w-6xl items-start">
          <div className="flex-shrink-0 md:order-2">
            <PlantSelectionPanel
              plantsToDisplay={ALL_PLANTS_SORTED}
              onSelectPlant={handlePlantSelection}
              selectedPlantName={selectedPlantName}
              currentSunlight={sunlight}
              isShovelModeActive={isShovelModeActive}
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
                isShovelModeActive={isShovelModeActive}
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
          <p>小提示：产阳光的植物是你的经济命脉（它们的名称在选择面板里是金色的哦！）。使用 <Shovel className="inline w-3 h-3" /> 铲子可以移除植物。</p>
        </footer>
      </div>
    </DndProvider>
  );
}
