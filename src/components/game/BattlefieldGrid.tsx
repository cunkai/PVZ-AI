"use client";

import type { FC, ReactNode } from 'react';
import Image from 'next/image';
import { GRID_COLS, GRID_ROWS, CELL_SIZE, PLANTS_DATA, ZOMBIES_DATA } from '@/config/gameConfig';
import type { PlantInstance, ZombieInstance, ProjectileInstance } from '@/types';
import { cn } from '@/lib/utils';

interface BattlefieldGridProps {
  plants: PlantInstance[];
  zombies: ZombieInstance[];
  projectiles: ProjectileInstance[];
  onCellClick: (row: number, col: number) => void;
  selectedPlantName: string | null;
}

const BattlefieldGrid: FC<BattlefieldGridProps> = ({ plants, zombies, projectiles, onCellClick, selectedPlantName }) => {
  const gridCells: ReactNode[] = [];

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const isEvenRow = row % 2 === 0;
      const isEvenCol = col % 2 === 0;
      const cellBgClass = (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)
        ? 'bg-green-200/50 dark:bg-green-800/50' // Lighter green tone
        : 'bg-green-300/50 dark:bg-green-700/50'; // Darker green tone
      
      gridCells.push(
        <div
          key={`${row}-${col}`}
          className={cn(
            "border border-green-400/50 dark:border-green-600/50 flex items-center justify-center relative",
            cellBgClass,
            selectedPlantName ? "cursor-pointer hover:bg-yellow-300/30 dark:hover:bg-yellow-700/30" : ""
          )}
          style={{ width: CELL_SIZE, height: CELL_SIZE }}
          onClick={() => onCellClick(row, col)}
          role="button"
          aria-label={`Place plant at row ${row + 1}, column ${col + 1}`}
          tabIndex={0}
        >
          {/* Visual indicator for selected plant placement */}
          {selectedPlantName && (
            <div className="absolute inset-0 bg-yellow-400/20 pointer-events-none"></div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="relative bg-background shadow-inner overflow-hidden border-4 border-yellow-600 rounded-lg" style={{ width: GRID_COLS * CELL_SIZE, height: GRID_ROWS * CELL_SIZE }}>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
        }}
      >
        {gridCells}
      </div>
      
      {/* Render Plants */}
      {plants.map(plant => {
        const plantData = PLANTS_DATA[plant.type];
        return (
          <div
            key={plant.id}
            className="absolute transition-all duration-100 ease-linear flex flex-col items-center justify-center"
            style={{
              left: plant.x * CELL_SIZE + (CELL_SIZE - plantData.imageWidth) / 2,
              top: plant.y * CELL_SIZE + (CELL_SIZE - plantData.imageHeight) / 2,
              width: plantData.imageWidth,
              height: plantData.imageHeight,
            }}
            title={`${plant.type} (HP: ${plant.health})`}
          >
            <Image
              src={`https://placehold.co/${plantData.imageWidth}x${plantData.imageHeight}.png`}
              alt={plant.type}
              width={plantData.imageWidth}
              height={plantData.imageHeight}
              data-ai-hint={plantData.imageHint}
              className="object-contain"
            />
            {/* Optional: Health bar for plants */}
             <div className="w-full h-1 bg-red-500 rounded-full mt-1">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${(plant.health / plantData.health) * 100}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* Render Zombies */}
      {zombies.map(zombie => {
        const zombieData = ZOMBIES_DATA[zombie.type];
        const visualXOffset = (CELL_SIZE - zombieData.imageWidth) / 2;
        const visualYOffset = (CELL_SIZE - zombieData.imageHeight) / 2;

        return (
          <div
            key={zombie.id}
            className="absolute transition-all duration-100 ease-linear flex flex-col items-center justify-center" // GAME_TICK_MS for smooth movement
            style={{
              left: zombie.x * CELL_SIZE + visualXOffset,
              top: zombie.y * CELL_SIZE + visualYOffset,
              width: zombieData.imageWidth,
              height: zombieData.imageHeight,
            }}
            title={`${zombie.type} (HP: ${zombie.health})`}
          >
            <Image
              src={`https://placehold.co/${zombieData.imageWidth}x${zombieData.imageHeight}.png`}
              alt={zombie.type}
              width={zombieData.imageWidth}
              height={zombieData.imageHeight}
              data-ai-hint={zombieData.imageHint}
              className="object-contain"
            />
             {/* Optional: Health bar for zombies */}
            <div className="w-full h-1 bg-gray-500 rounded-full mt-1">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${(zombie.health / zombieData.health) * 100}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* Render Projectiles */}
      {projectiles.map(proj => (
        <div
          key={proj.id}
          className={cn(
            "absolute rounded-full",
            proj.plantType === 'Peashooter' || proj.plantType === 'ElectricPeashooter' || proj.plantType === 'PepperPult' ? 'bg-green-500 w-3 h-3' : '',
            proj.plantType === 'ElectricPeashooter' || proj.plantType === 'ElectricReed' ? 'bg-yellow-400 w-3 h-3 shadow-[0_0_5px_2px_theme(colors.yellow.300)]' : '',
            proj.plantType === 'PepperPult' ? 'bg-orange-500 w-4 h-4' : ''
          )}
          style={{
            left: proj.x * CELL_SIZE + CELL_SIZE / 2 - 6, // Center projectile
            top: proj.y * CELL_SIZE + CELL_SIZE / 2 - 6,  // Center projectile
          }}
        />
      ))}
    </div>
  );
};

export default BattlefieldGrid;
