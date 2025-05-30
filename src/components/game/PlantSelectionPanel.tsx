"use client";

import type { FC } from 'react';
import type { PlantData, PlantName } from '@/types';
import PlantCard from './PlantCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PlantSelectionPanelProps {
  plantsData: Record<PlantName, PlantData>;
  onSelectPlant: (plantName: PlantName) => void;
  selectedPlantName: PlantName | null;
  currentSunlight: number;
}

const PlantSelectionPanel: FC<PlantSelectionPanelProps> = ({
  plantsData,
  onSelectPlant,
  selectedPlantName,
  currentSunlight,
}) => {
  const availablePlants = Object.values(plantsData);

  return (
    <Card className="p-4 shadow-xl bg-card/80 backdrop-blur-sm fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl md:relative md:bottom-auto md:left-auto md:transform-none md:max-w-xs md:h-full">
      <h3 className="text-lg font-semibold mb-3 text-center md:text-left text-primary-foreground">Choose Your Plants!</h3>
      <ScrollArea className="h-[180px] md:h-full">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-2 gap-3 pr-3">
          {availablePlants.map((plant) => (
            <PlantCard
              key={plant.name}
              plant={plant}
              onSelect={onSelectPlant}
              isSelected={selectedPlantName === plant.name}
              disabled={currentSunlight < plant.cost}
              showCost={true}
            />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </Card>
  );
};

export default PlantSelectionPanel;
