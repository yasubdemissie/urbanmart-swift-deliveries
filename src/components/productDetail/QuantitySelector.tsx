import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  max?: number;
  min?: number;
}

const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  max = 99, 
  min = 1 
}: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="quantity"
        size="icon"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="h-10 w-10 rounded-lg"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-muted-foreground/20 bg-background text-sm font-medium">
        {quantity}
      </div>
      
      <Button
        variant="quantity"
        size="icon"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="h-10 w-10 rounded-lg"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;