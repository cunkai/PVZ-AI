
"use client";

import type { FC, ReactNode } from 'react';
import { GRID_COLS, GRID_ROWS, CELL_SIZE, PLANTS_DATA, ZOMBIES_DATA } from '@/config/gameConfig';
import type { PlantInstance, ZombieInstance, ProjectileInstance, PlantName, ZombieName } from '@/types';
import { cn } from '@/lib/utils';

interface BattlefieldGridProps {
  plants: PlantInstance[];
  zombies: ZombieInstance[];
  projectiles: ProjectileInstance[];
  onCellClick: (row: number, col: number) => void;
  selectedPlantName: PlantName | null;
}

const RenderPlantSvg: FC<{ type: PlantName; width: number; height: number }> = ({ type, width, height }) => {
  switch (type) {
    case '豌豆射手':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="40" width="10" height="20" fill="#38761D" /> {/* Stem */}
          <circle cx="30" cy="25" r="20" fill="#6AA84F" /> {/* Head */}
          <ellipse cx="45" cy="25" rx="8" ry="4" fill="#38761D" /> {/* Mouth/Snout */}
          <circle cx="22" cy="18" r="5" fill="white" /><circle cx="22" cy="18" r="2.5" fill="black" /> {/* Eye */}
        </svg>
      );
    case '太阳花':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="27" y="45" width="6" height="15" fill="#38761D" /> {/* Stem */}
          <circle cx="30" cy="30" r="18" fill="#F1C232" /> {/* Center */}
          <ellipse transform="rotate(0 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(45 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(90 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(135 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(180 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(225 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(270 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(315 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <circle cx="30" cy="30" r="10" fill="#B45309" /> {/* Inner center */}
        </svg>
      );
    case '坚果墙': 
      return (
        <svg width={width} height={height} viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="38" rx="28" ry="32" fill="#8D6E63" /> {/* Main body */}
          <path d="M15 20 Q30 5 45 20 Q60 35 45 50 Q30 65 15 50 Q0 35 15 20 Z" stroke="#5D4037" strokeWidth="2" fill="none" opacity="0.5" />
          <ellipse cx="30" cy="38" rx="20" ry="25" fill="#A1887F" />
          <line x1="30" y1="10" x2="30" y2="25" stroke="#5D4037" strokeWidth="3"/> {/* Top crack */}
          <circle cx="20" cy="30" r="3" fill="#5D4037" /> <circle cx="40" cy="45" r="3" fill="#5D4037" />
        </svg>
      );
    case '电能豌豆射手': 
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="40" width="10" height="20" fill="#1E3A8A" /> {/* Stem - blueish */}
          <circle cx="30" cy="25" r="20" fill="#3B82F6" /> {/* Head - blue */}
          <ellipse cx="45" cy="25" rx="8" ry="4" fill="#1E3A8A" /> {/* Mouth/Snout */}
          <circle cx="22" cy="18" r="5" fill="white" /><circle cx="22" cy="18" r="2.5" fill="#FACC15" /> {/* Eye - yellow pupil */}
          <path d="M50 20 L55 15 L53 22 L58 20 L50 30 L52 23 L48 25 Z" fill="#FDE047" /> {/* Spark */}
        </svg>
      );
    case '闪电芦苇': 
      return (
        <svg width={width} height={height} viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="5" width="10" height="60" fill="#60A5FA" rx="3"/>
          <rect x="20" y="10" width="10" height="55" fill="#3B82F6" rx="3"/>
          <rect x="32" y="5" width="10" height="60" fill="#60A5FA" rx="3"/>
          <circle cx="13" cy="5" r="4" fill="#FDE047" />
          <circle cx="25" cy="10" r="4" fill="#FDE047" />
          <circle cx="37" cy="5" r="4" fill="#FDE047" />
        </svg>
      );
    case '芹菜潜行者': 
      return (
        <svg width={width} height={height} viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="35" cy="52" rx="30" ry="8" fill="#556B2F" /> {/* Base */}
          <path d="M20 50 C25 20, 30 15, 35 10 L40 12 C35 20, 30 25, 25 50 Z" fill="#6B8E23" />
          <path d="M35 50 C40 20, 45 15, 50 10 L55 12 C50 20, 45 25, 40 50 Z" fill="#8FBC8F" />
          <path d="M25 45 L15 40 L20 35 Q35 40 40 35 L45 40 L35 48 Z" fill="darkgreen" /> {/* Eyes-like leaves */}
        </svg>
      );
    case '辣椒投手': 
      return (
        <svg width={width} height={height} viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="55" width="50" height="10" fill="#A0522D" rx="3"/> {/* Base */}
          <rect x="30" y="15" width="10" height="45" fill="#8B4513" transform="rotate(-25 35 37.5)"/> {/* Arm */}
          <ellipse cx="20" cy="15" rx="10" ry="8" fill="#FF6347" transform="translate(0,0) rotate(-25 35 37.5)"/> {/* Pepper Bucket */}
           <circle cx="20" cy="15" r="7" fill="#DC2626" transform="translate(0,0) rotate(-25 35 37.5)"/>
        </svg>
      );
    default:
      return <div style={{ width, height, backgroundColor: 'lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '1px solid black', boxSizing: 'border-box' }}>{type}</div>;
  }
};

const RenderZombieSvg: FC<{ type: ZombieName; width: number; height: number }> = ({ type, width, height }) => {
  switch (type) {
    case '普通僵尸': 
      return (
        <svg width={width} height={height} viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="28" width="36" height="47" fill="#787A77" rx="5"/> {/* Body */}
          <circle cx="30" cy="18" r="13" fill="#A8A9A5"/> {/* Head */}
          <rect x="5" y="35" width="10" height="25" fill="#696B68" transform="rotate(-10 7 35)"/> {/* Left Arm */}
          <rect x="45" y="35" width="10" height="25" fill="#696B68" transform="rotate(10 48 35)"/> {/* Right Arm */}
          <rect x="15" y="72" width="12" height="8" fill="#5A5C5A"/> {/* Left Leg */}
          <rect x="33" y="72" width="12" height="8" fill="#5A5C5A"/> {/* Right Leg */}
          <circle cx="24" cy="16" r="3" fill="#E74C3C" /> <circle cx="36" cy="16" r="3" fill="#E74C3C" /> {/* Eyes */}
          <line x1="25" y1="23" x2="35" y2="23" stroke="black" strokeWidth="1.5" /> {/* Mouth */}
        </svg>
      );
    case '路障僵尸': 
      return (
        <svg width={width} height={height} viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="30" width="36" height="45" fill="#787A77" rx="5"/> {/* Body */}
          <circle cx="30" cy="20" r="13" fill="#A8A9A5"/> {/* Head */}
          <rect x="5" y="37" width="10" height="25" fill="#696B68" transform="rotate(-10 7 37)"/> {/* Left Arm */}
          <rect x="45" y="37" width="10" height="25" fill="#696B68" transform="rotate(10 48 37)"/> {/* Right Arm */}
          <rect x="15" y="72" width="12" height="8" fill="#5A5C5A"/> {/* Left Leg */}
          <rect x="33" y="72" width="12" height="8" fill="#5A5C5A"/> {/* Right Leg */}
          <circle cx="24" cy="18" r="3" fill="#E74C3C" /> <circle cx="36" cy="18" r="3" fill="#E74C3C" /> {/* Eyes */}
          <line x1="25" y1="25" x2="35" y2="25" stroke="black" strokeWidth="1.5" /> {/* Mouth */}
          {/* Cone */}
          <polygon points="30,0 18,22 42,22" fill="#E67E22"/>
          <path d="M18,22 Q30,26 42,22 L30,0 Z" fill="#D35400" opacity="0.7"/>
        </svg>
      );
    case '舞王僵尸': 
        return (
            <svg width={width} height={height} viewBox="0 0 70 80" xmlns="http://www.w3.org/2000/svg">
              <rect x="15" y="28" width="40" height="47" fill="#8E44AD" rx="5"/> {/* Body - purple suit */}
              <circle cx="35" cy="18" r="13" fill="#BDC3C7"/> {/* Head */}
              <path d="M25 6 Q35 -2 45 6 L42 15 L28 15 Z" fill="#2C3E50"/> {/* Hair */}
              <rect x="2" y="32" width="12" height="28" fill="#8E44AD" transform="rotate(-35 8 32)"/> {/* Left Arm up */}
              <rect x="56" y="32" width="12" height="28" fill="#8E44AD" transform="rotate(35 62 32)"/> {/* Right Arm up */}
              <rect x="20" y="72" width="13" height="8" fill="#7D3C98"/> {/* Left Leg */}
              <rect x="37" y="72" width="13" height="8" fill="#7D3C98"/> {/* Right Leg */}
              <circle cx="30" cy="16" r="3" fill="#F1C40F" /> <circle cx="40" cy="16" r="3" fill="#F1C40F" /> {/* Eyes - yellow */}
              <path d="M30 23 Q35 26 40 23" stroke="black" strokeWidth="1.5" fill="none"/> {/* Smile */}
            </svg>
        );
    case '僵王博士': 
        return (
            <svg width={width} height={height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="15" y="35" width="70" height="60" fill="#4A4A4A" rx="10"/> {/* Main Body - Darker */}
              <rect x="10" y="25" width="80" height="20" fill="#5A5A5A" rx="5"/> {/* Shoulder part */}
              <circle cx="50" cy="20" r="18" fill="#6A6A6A"/> {/* Head */}
              <rect x="30" y="0" width="40" height="8" fill="#F39C12"/> {/* Helmet top */}
              <polygon points="30,8 70,8 75,2 25,2" fill="#F1C40F"/> {/* Helmet front */}
              <rect x="5" y="50" width="20" height="40" fill="#3A3A3A" rx="5"/> {/* Left Arm thick */}
              <rect x="75" y="50" width="20" height="40" fill="#3A3A3A" rx="5"/> {/* Right Arm thick */}
              <circle cx="40" cy="18" r="5" fill="red" /> <circle cx="60" cy="18" r="5" fill="red" /> {/* Big Red Eyes */}
              <line x1="42" y1="28" x2="58" y2="28" stroke="#2C3E50" strokeWidth="3" /> {/* Mouth */}
            </svg>
        );
    default:
      return <div style={{ width, height, backgroundColor: 'lightpink', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '1px solid black', boxSizing: 'border-box' }}>{type}</div>;
  }
};


const BattlefieldGrid: FC<BattlefieldGridProps> = ({ plants, zombies, projectiles, onCellClick, selectedPlantName }) => {
  const gridCells: ReactNode[] = [];

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const isEvenRow = row % 2 === 0;
      const isEvenCol = col % 2 === 0;
      const cellBgClass = (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)
        ? 'bg-green-200/50 dark:bg-green-800/50' 
        : 'bg-green-300/50 dark:bg-green-700/50'; 
      
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
          aria-label={`在行 ${row + 1}, 列 ${col + 1} 放置植物`}
          tabIndex={0}
        >
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
            title={`${plantData.name} (生命值: ${plant.health})`}
          >
            <RenderPlantSvg type={plant.type} width={plantData.imageWidth} height={plantData.imageHeight} />
             <div className="w-full h-1 bg-red-500 rounded-full mt-1">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${(plant.health / plantData.health) * 100}%` }}
              />
            </div>
          </div>
        );
      })}

      {zombies.map(zombie => {
        const zombieData = ZOMBIES_DATA[zombie.type];
        const visualXOffset = (CELL_SIZE - zombieData.imageWidth) / 2;
        const visualYOffset = (CELL_SIZE - zombieData.imageHeight) / 2;

        return (
          <div
            key={zombie.id}
            className="absolute transition-all duration-100 ease-linear flex flex-col items-center justify-center" 
            style={{
              left: zombie.x * CELL_SIZE + visualXOffset,
              top: zombie.y * CELL_SIZE + visualYOffset,
              width: zombieData.imageWidth,
              height: zombieData.imageHeight,
            }}
            title={`${zombieData.name} (生命值: ${zombie.health})`}
          >
            <RenderZombieSvg type={zombie.type} width={zombieData.imageWidth} height={zombieData.imageHeight} />
            <div className="w-full h-1 bg-gray-500 rounded-full mt-1">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${(zombie.health / zombieData.health) * 100}%` }}
              />
            </div>
          </div>
        );
      })}

      {projectiles.map(proj => (
        <div
          key={proj.id}
          className={cn(
            "absolute rounded-full",
            (proj.plantType === '豌豆射手' || proj.plantType === '电能豌豆射手' || proj.plantType === '辣椒投手') ? 'bg-green-500 w-3 h-3' : '',
            (proj.plantType === '电能豌豆射手' || proj.plantType === '闪电芦苇') ? 'bg-yellow-400 w-3 h-3 shadow-[0_0_5px_2px_theme(colors.yellow.300)]' : '',
            proj.plantType === '辣椒投手' ? 'bg-orange-500 w-4 h-4' : ''
          )}
          style={{
            left: proj.x * CELL_SIZE + CELL_SIZE / 2 - 6, 
            top: proj.y * CELL_SIZE + CELL_SIZE / 2 - 6,  
          }}
        />
      ))}
    </div>
  );
};

export default BattlefieldGrid;
