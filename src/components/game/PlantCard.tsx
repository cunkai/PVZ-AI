
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
    default:
      return <div style={{ width, height, backgroundColor: 'lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '1px solid black', boxSizing: 'border-box' }} className={className}>{type}</div>;
  }
};

const PlantCard: FC<PlantCardProps> = ({ plant, onSelect, isSelected, disabled, showCost = true }) => {
  return (
    <Card 
      className={cn(
        "w-full h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200",
        isSelected && "ring-2 ring-primary shadow-xl",
        disabled && "opacity-60 cursor-not-allowed",
        !onSelect && "cursor-default" 
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
        <CardTitle className="text-base leading-tight">{plant.name}</CardTitle>
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
