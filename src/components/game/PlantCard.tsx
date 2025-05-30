"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Sun, Zap, Shield, Carrot, Leaf, CircleDollarSign } from 'lucide-react'; // Using Carrot for PepperPult, Leaf for Celery for variety
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PlantData, PlantName } from '@/types';
import { cn } from '@/lib/utils';

interface PlantCardProps {
  plant: PlantData;
  onSelect?: (plantName: PlantName) => void;
  isSelected?: boolean;
  disabled?: boolean; // e.g. not enough sun
  showCost?: boolean;
}

const PlantIcon: FC<{ name: PlantName, className?: string }> = ({ name, className }) => {
  const iconProps = { className: cn("w-8 h-8", className) };
  switch (name) {
    case 'Peashooter': return <Leaf {...iconProps} />;
    case 'Sunflower': return <Sun {...iconProps} />;
    case 'WallNut': return <Shield {...iconProps} />;
    case 'ElectricPeashooter': return <Zap {...iconProps} />;
    case 'ElectricReed': return <Zap {...iconProps} className={cn("opacity-70", className)} />;
    case 'CeleryStalker': return <Carrot {...iconProps} />; // Placeholder icon
    case 'PepperPult': return <Carrot {...iconProps} className={cn("text-destructive", className)} />; // Placeholder icon
    default: return <Leaf {...iconProps} />;
  }
};

const PlantCard: FC<PlantCardProps> = ({ plant, onSelect, isSelected, disabled, showCost = true }) => {
  return (
    <Card 
      className={cn(
        "w-full h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200",
        isSelected && "ring-2 ring-primary shadow-xl",
        disabled && "opacity-60 cursor-not-allowed",
        !onSelect && "cursor-default" // If not selectable (e.g. on grid)
      )}
      onClick={() => onSelect && !disabled && onSelect(plant.name)}
    >
      <CardHeader className="p-3 items-center">
        <Image 
          src={`https://placehold.co/${plant.imageWidth}x${plant.imageHeight}.png`}
          alt={plant.name}
          width={plant.imageWidth}
          height={plant.imageHeight}
          data-ai-hint={plant.imageHint}
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
            aria-label={`Select ${plant.name}`}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PlantCard;
