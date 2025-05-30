
"use client";

import type { FC } from 'react';
import type { PlantData, PlantName } from '@/types';
import PlantCard from './PlantCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface PlantSelectionPanelProps {
  plantsToDisplay: PlantData[]; // Changed from plantsData
  onSelectPlant: (plantName: PlantName) => void;
  selectedPlantName: PlantName | null;
  currentSunlight: number;
}

const PlantSelectionPanel: FC<PlantSelectionPanelProps> = ({
  plantsToDisplay, // Changed from plantsData
  onSelectPlant,
  selectedPlantName,
  currentSunlight,
}) => {
  return (
    <Card className="p-4 shadow-2xl bg-card backdrop-blur-sm fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl md:relative md:bottom-auto md:left-auto md:transform-none md:max-w-xs">
      <h3 className="text-xl font-bold mb-4 text-center md:text-left text-primary-foreground drop-shadow-sm">选择你的植物！</h3>
      <ScrollArea className="h-[180px] md:h-[340px]">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-2 gap-3 pr-3">
          {plantsToDisplay.map((plant) => (
            <PlantCard
              key={plant.name}
              plant={plant}
              onSelect={onSelectPlant}
              isSelected={selectedPlantName === plant.name}
              disabled={currentSunlight < plant.cost}
              showCost={true}
              isSunProducer={plant.sunProduction && plant.sunProduction > 0}
            />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </Card>
  );
};

export default PlantSelectionPanel;
