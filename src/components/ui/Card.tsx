import { cn } from '../../lib/cn';
import type { HomeCard } from '../../types';
import { CardImage } from './CardImage';

interface CardProps {
  card: HomeCard;
  onClick?: () => void;
  className?: string;
}

export function Card({ card, onClick, className }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group cursor-pointer flex flex-col p-4',
        'rounded-[11.4046px] bg-canvas',
        'transition-all duration-200 ease-out',
        'shadow-[0px_4px_24px_rgba(69,36,219,0.12)]',
        'hover:shadow-[0px_8px_32px_rgba(69,36,219,0.25)]',
        'hover:-translate-y-2',
        'active:scale-[0.98]',
        className
      )}
    >
      {/* Image container - show full card without cropping */}
      <div className="w-full mb-4 flex items-center justify-center">
        <div className="relative w-full max-w-[180px] mx-auto">
          <CardImage
            src={card.image_url}
            alt={card.name}
            className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Card info */}
      <div className="text-center">
        <h3 className="text-body font-medium text-ink-black mb-1 line-clamp-1">
          {card.name}
        </h3>
        {card.archetype && (
          <p className="text-body-sm text-muted-text mb-2 line-clamp-1">
            {card.archetype}
          </p>
        )}
        <p className="text-caption text-soft-gray flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-shop-violet"></span>
          {card.owner_count} {card.owner_count === 1 ? 'owner' : 'owners'}
        </p>
      </div>
    </div>
  );
}