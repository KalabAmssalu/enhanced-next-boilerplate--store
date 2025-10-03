import React from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { performanceUtils } from "../lib/performance";

interface ImageProps extends Omit<NextImageProps, "onLoad"> {
  onLoad?: () => void;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export const Image: React.FC<ImageProps> = ({
  onLoad,
  priority = false,
  placeholder = "empty",
  blurDataURL,
  ...props
}) => {
  const handleLoad = () => {
    if (onLoad) {
      onLoad();
    }
  };

  const handleError = () => {
    console.warn("Image failed to load:", props.src);
  };

  return (
    <NextImage
      {...props}
      onLoad={handleLoad}
      onError={handleError}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      quality={props.quality || 85}
      sizes={
        props.sizes ||
        "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      }
    />
  );
};

// Optimized image component with lazy loading
export const LazyImage: React.FC<ImageProps> = (props) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="relative">
      {isInView && (
        <Image
          {...props}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${props.className || ""}`}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
    </div>
  );
};

export default Image;
