
"use client";

import type { FC } from 'react';
import { Sun, Zap, Shield, Carrot, Leaf, CircleDollarSign } from 'lucide-react'; 
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PlantData, PlantName } from '@/types';
import { cn } from '@/lib/utils';

interface PlantCardProps {
  plant: PlantData;
  onSelect?: (plantName: PlantName) => void;
  isSelected?: boolean;
  disabled?: boolean; 
  showCost?: boolean;
  isSunProducer?: boolean;
}

const RenderPlantSvg: FC<{ type: PlantName; width: number; height: number, className?: string }> = ({ type, width, height, className }) => {
  switch (type) {
    case '豌豆射手':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="25" y="40" width="10" height="20" fill="#38761D" /> 
          <circle cx="30" cy="25" r="20" fill="#6AA84F" /> 
          <ellipse cx="45" cy="25" rx="8" ry="4" fill="#38761D" /> 
          <circle cx="22" cy="18" r="5" fill="white" /><circle cx="22" cy="18" r="2.5" fill="black" /> 
        </svg>
      );
    case '太阳花':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="27" y="45" width="6" height="15" fill="#38761D" /> 
          <circle cx="30" cy="30" r="18" fill="#F1C232" /> 
          <ellipse transform="rotate(0 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(45 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(90 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(135 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(180 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(225 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(270 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <ellipse transform="rotate(315 30 30)" cx="30" cy="10" rx="7" ry="10" fill="#FFD966"/>
          <circle cx="30" cy="30" r="10" fill="#B45309" /> 
        </svg>
      );
    case '坚果墙':
      return (
        <svg width={width} height={height} viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg" className={className}>
          <ellipse cx="30" cy="38" rx="28" ry="32" fill="#8D6E63" />
          <path d="M15 20 Q30 5 45 20 Q60 35 45 50 Q30 65 15 50 Q0 35 15 20 Z" stroke="#5D4037" strokeWidth="2" fill="none" opacity="0.5" />
          <ellipse cx="30" cy="38" rx="20" ry="25" fill="#A1887F" />
          <line x1="30" y1="10" x2="30" y2="25" stroke="#5D4037" strokeWidth="3"/>
          <circle cx="20" cy="30" r="3" fill="#5D4037" /> <circle cx="40" cy="45" r="3" fill="#5D4037" />
        </svg>
      );
    case '电能豌豆射手':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="25" y="40" width="10" height="20" fill="#1E3A8A" />
          <circle cx="30" cy="25" r="20" fill="#3B82F6" />
          <ellipse cx="45" cy="25" rx="8" ry="4" fill="#1E3A8A" />
          <circle cx="22" cy="18" r="5" fill="white" /><circle cx="22" cy="18" r="2.5" fill="#FACC15" />
          <path d="M50 20 L55 15 L53 22 L58 20 L50 30 L52 23 L48 25 Z" fill="#FDE047" />
        </svg>
      );
    case '闪电芦苇':
      return (
        <svg width={width} height={height} viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg" className={className}>
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
        <svg width={width} height={height} viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg" className={className}>
          <ellipse cx="35" cy="52" rx="30" ry="8" fill="#556B2F" />
          <path d="M20 50 C25 20, 30 15, 35 10 L40 12 C35 20, 30 25, 25 50 Z" fill="#6B8E23" />
          <path d="M35 50 C40 20, 45 15, 50 10 L55 12 C50 20, 45 25, 40 50 Z" fill="#8FBC8F" />
          <path d="M25 45 L15 40 L20 35 Q35 40 40 35 L45 40 L35 48 Z" fill="darkgreen" />
        </svg>
      );
    case '辣椒投手':
      return (
        <svg width={width} height={height} viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="10" y="55" width="50" height="10" fill="#A0522D" rx="3"/>
          <rect x="30" y="15" width="10" height="45" fill="#8B4513" transform="rotate(-25 35 37.5)"/>
          <ellipse cx="20" cy="15" rx="10" ry="8" fill="#FF6347" transform="translate(0,0) rotate(-25 35 37.5)"/>
           <circle cx="20" cy="15" r="7" fill="#DC2626" transform="translate(0,0) rotate(-25 35 37.5)"/>
        </svg>
      );
    case '冰冻射手':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="25" y="40" width="10" height="20" fill="#5DADE2" />
          <circle cx="30" cy="25" r="20" fill="#A9CCE3" />
          <ellipse cx="45" cy="25" rx="8" ry="4" fill="#5DADE2" />
          <circle cx="22" cy="18" r="5" fill="white" /><circle cx="22" cy="18" r="2.5" fill="#2E86C1" />
          <path d="M30 8 L28 12 L32 12 Z M26 14 L34 14 L30 18 Z" fill="white" stroke="#A9CCE3" strokeWidth="0.5"/>
          <line x1="30" y1="5" x2="30" y2="10" stroke="white" strokeWidth="1.5"/>
          <line x1="26" y1="7" x2="34" y2="11" stroke="white" strokeWidth="1.5"/>
          <line x1="26" y1="11" x2="34" y2="7" stroke="white" strokeWidth="1.5"/>
        </svg>
      );
    case '火焰菇':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="22" y="35" width="16" height="25" fill="#A0522D" rx="4"/>
          <path d="M10 40 Q15 15, 30 5 Q45 15, 50 40 Z" fill="#E67E22" />
          <path d="M15 38 Q20 20, 30 10 Q40 20, 45 38 Z" fill="#F39C12" opacity="0.8"/>
          <path d="M20 35 Q25 25, 30 15 Q35 25, 40 35 Z" fill="#F5B041" opacity="0.7"/>
          <circle cx="20" cy="28" r="4" fill="#DC2626" /> <circle cx="40" cy="28" r="4" fill="#DC2626" />
        </svg>
      );
    case '双子向日葵':
      return (
         <svg width={width} height={height} viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="32" y="50" width="6" height="20" fill="#38761D"/>
          <g transform="translate(-12, 0)">
            <rect x="27" y="45" width="6" height="10" fill="#38761D" transform="rotate(-15 30 50)"/>
            <circle cx="30" cy="30" r="16" fill="#F1C232"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <ellipse key={`l-${angle}`} transform={`rotate(${angle} 30 30)`} cx="30" cy="12" rx="6" ry="9" fill="#FFD966"/>
            ))}
            <circle cx="30" cy="30" r="9" fill="#B45309"/>
          </g>
          <g transform="translate(12, 0)">
             <rect x="27" y="45" width="6" height="10" fill="#38761D" transform="rotate(15 30 50)"/>
            <circle cx="30" cy="30" r="16" fill="#F1C232"/>
             {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <ellipse key={`r-${angle}`} transform={`rotate(${angle} 30 30)`} cx="30" cy="12" rx="6" ry="9" fill="#FFD966"/>
            ))}
            <circle cx="30" cy="30" r="9" fill="#B45309"/>
          </g>
        </svg>
      );
    case '磁力菇':
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="25" y="35" width="10" height="25" fill="#8A2BE2" rx="3"/> {/* Stem */}
          <path d="M15 10 C 5 10, 5 35, 15 35 L 15 40 L 10 40 L 10 5 L 15 5 L 15 10 Z" fill="#C0C0C0" stroke="#A9A9A9" strokeWidth="2"/> {/* Left magnet arm */}
          <path d="M45 10 C 55 10, 55 35, 45 35 L 45 40 L 50 40 L 50 5 L 45 5 L 45 10 Z" fill="#C0C0C0" stroke="#A9A9A9" strokeWidth="2"/> {/* Right magnet arm */}
          <ellipse cx="30" cy="20" rx="18" ry="15" fill="#E6E6FA" /> {/* Head base */}
          <path d="M15 5 Q30 -5 45 5" stroke="#A9A9A9" strokeWidth="2" fill="none"/> {/* Top curve */}
          <circle cx="22" cy="20" r="4" fill="black" /> <circle cx="38" cy="20" r="4" fill="black" /> {/* Eyes */}
        </svg>
      );
    case '分裂豆':
      return (
        <svg width={width} height={height} viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="30" y="40" width="10" height="20" fill="#38761D" /> {/* Stem */}
          <g> {/* Front Head */}
            <circle cx="35" cy="25" r="20" fill="#6AA84F" />
            <ellipse cx="50" cy="25" rx="8" ry="4" fill="#38761D" /> {/* Mouth */}
            <circle cx="27" cy="18" r="5" fill="white" /><circle cx="27" cy="18" r="2.5" fill="black" /> {/* Eye */}
          </g>
          <g transform="translate(0, 5)"> {/* Back Head */}
            <circle cx="15" cy="25" r="15" fill="#5A9A3F" /> 
            <ellipse cx="3" cy="25" rx="6" ry="3" fill="#38761D" /> 
             <circle cx="20" cy="18" r="4" fill="white" /><circle cx="20" cy="18" r="2" fill="black" /> 
          </g>
        </svg>
      );
    case '胆小菇':
      return (
        <svg width={width} height={height} viewBox="0 0 55 70" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="22" y="30" width="11" height="40" fill="#DDA0DD" rx="4"/> {/* Stem (lavender) */}
          <ellipse cx="27.5" cy="20" rx="20" ry="18" fill="#EE82EE" /> {/* Cap Base (violet) - Changed from PLUM */}
           <path d="M10 25 Q27.5 0 45 25" fill="#DA70D6" opacity="0.7" /> {/* Cap Top (orchid) */}
          <circle cx="20" cy="18" r="6" fill="white" stroke="black" strokeWidth="1"><animate attributeName="r" values="6;4;6" dur="1s" repeatCount="indefinite" /></circle> 
          <circle cx="35" cy="18" r="6" fill="white" stroke="black" strokeWidth="1"><animate attributeName="r" values="6;4;6" dur="1s" repeatCount="indefinite" /></circle>
          <circle cx="20" cy="18" r="2.5" fill="black" /> <circle cx="35" cy="18" r="2.5" fill="black" /> {/* Pupils */}
        </svg>
      );
    case '仙人掌':
      return (
        <svg width={width} height={height} viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M30 70 C20 70 15 60 15 50 C15 35 25 30 30 10 C35 30 45 35 45 50 C45 60 40 70 30 70 Z" fill="#558B2F"/>
          <path d="M15 50 C5 50 0 40 5 30 C10 25 15 35 15 40 Z" fill="#689F38" transform="translate(-2, -5) rotate(-10 10 35)"/>
          <path d="M45 50 C55 50 60 40 55 30 C50 25 45 35 45 40 Z" fill="#689F38" transform="translate(2, -5) rotate(10 50 35)"/>
          <circle cx="30" cy="12" r="5" fill="#FFEB3B"/> <circle cx="30" cy="12" r="2.5" fill="#F9A825"/>
          {[...Array(5)].map((_, i) => <line key={`s1-${i}`} x1={30 + (i-2)*5} y1="25" x2={30 + (i-2)*5} y2="28" stroke="#33691E" strokeWidth="1"/>)}
          {[...Array(4)].map((_, i) => <line key={`s2-${i}`} x1={15 + (i-1.5)*4} y1="35" x2={15 + (i-1.5)*4} y2="38" stroke="#33691E" strokeWidth="1"/>)}
          {[...Array(4)].map((_, i) => <line key={`s3-${i}`} x1={45 + (i-1.5)*4} y1="35" x2={45 + (i-1.5)*4} y2="38" stroke="#33691E" strokeWidth="1"/>)}
        </svg>
      );
    default:
      return <div style={{ width, height, backgroundColor: 'lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '1px solid black', boxSizing: 'border-box' }} className={className}>{type}</div>;
  }
};

const PlantCard: FC<PlantCardProps> = ({ plant, onSelect, isSelected, disabled, showCost = true, isSunProducer }) => {
  return (
    <Card 
      className={cn(
        "w-full h-full flex flex-col hover:shadow-lg transition-shadow duration-200",
        isSelected && "ring-2 ring-primary shadow-xl",
        disabled && "opacity-60 cursor-not-allowed",
        !onSelect && "cursor-default",
        onSelect && !disabled && "cursor-pointer"
      )}
      onClick={() => onSelect && !disabled && onSelect(plant.name)}
    >
      <CardHeader className="p-3 items-center flex justify-center" style={{ height: plant.imageHeight > 70 ? plant.imageHeight + 10 : 80 }}>
        <RenderPlantSvg 
            type={plant.name} 
            width={plant.imageWidth} 
            height={plant.imageHeight} 
            className="rounded-md object-contain aspect-square"
        />
      </CardHeader>
      <CardContent className="p-3 flex-grow text-center">
        <CardTitle className={cn(
            "text-base leading-tight",
            isSunProducer && "text-yellow-600 dark:text-yellow-400 font-bold"
            )}>
            {plant.name}
        </CardTitle>
        {showCost && (
            <div className="flex items-center justify-center text-sm text-muted-foreground mt-1">
                <CircleDollarSign className="w-4 h-4 mr-1 text-accent" />
                {plant.cost}
            </div>
        )}
      </CardContent>
      {onSelect && (
        <CardFooter className="p-2">
           <Button 
            variant={isSelected ? "default" : "secondary"} 
            size="sm" 
            className="w-full"
            disabled={disabled}
            aria-label={`选择 ${plant.name}`}
          >
            {isSelected ? "已选择" : "选择"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PlantCard;
