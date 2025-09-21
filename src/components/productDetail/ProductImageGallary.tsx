import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  mainImage?: string;
  productName: string;
}

const ProductImageGallery = ({
  images,
  mainImage,
  productName,
}: ProductImageGalleryProps) => {
  const allImages = mainImage ? [mainImage, ...images] : images;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 shadow-[var(--shadow-product)]">
        <img
          src={allImages[selectedImageIndex]}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((image, index) => {
            if (index === 0) return null;
            if (index === 2) return null;
            return (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300",
                  selectedImageIndex === index
                    ? "ring-2 ring-product-accent ring-offset-2 ring-offset-background scale-105"
                    : "hover:scale-105 hover:ring-1 hover:ring-muted-foreground/20 hover:ring-offset-1 hover:ring-offset-background"
                )}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
