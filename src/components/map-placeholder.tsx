'use client';
import Image from 'next/image';
import { BinIcon } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Bin } from '@/lib/types';

type MapPlaceholderProps = {
  bins: Bin[];
  onBinClick?: (bin: Bin) => void;
  highlightedBins?: string[];
};

const getBinColor = (type: Bin['type']) => {
  switch (type) {
    case 'plastic': return 'bg-blue-500';
    case 'paper': return 'bg-yellow-500';
    case 'glass': return 'bg-green-500';
    case 'organic': return 'bg-orange-700';
    default: return 'bg-gray-500';
  }
};

const getBinBorderColor = (type: Bin['type']) => {
    switch (type) {
      case 'plastic': return 'border-blue-300';
      case 'paper': return 'border-yellow-300';
      case 'glass': return 'border-green-300';
      case 'organic': return 'border-orange-500';
      default: return 'border-gray-300';
    }
  };

export function MapPlaceholder({ bins, onBinClick, highlightedBins = [] }: MapPlaceholderProps) {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map-background');

  return (
    <TooltipProvider>
      <div className="relative w-full aspect-square max-w-full overflow-hidden rounded-lg border shadow-sm">
        {mapImage && (
          <Image
            src={mapImage.imageUrl}
            alt={mapImage.description}
            fill
            className="object-cover"
            data-ai-hint={mapImage.imageHint}
            priority
          />
        )}
        {bins.map((bin) => (
          <Tooltip key={bin.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onBinClick?.(bin)}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                  getBinColor(bin.type),
                  highlightedBins.includes(bin.id) && "ring-4 ring-accent ring-offset-2",
                  "transition-all duration-300 hover:scale-125"
                )}
                style={{
                  top: `${bin.location.lat}%`,
                  left: `${bin.location.lng}%`,
                }}
                aria-label={`Bin ${bin.id}, type ${bin.type}`}
              >
                <BinIcon type={bin.type} className="h-4 w-4 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Bin ID: {bin.id}</p>
                <p className="capitalize">Type: {bin.type}</p>
                <p>Fill Level: {bin.fillLevel}%</p>
                <p className="capitalize">Status: {bin.status}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
