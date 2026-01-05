'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    sizes?: string;
    onError?: () => void;
}

export function OptimizedImage({
                                   src,
                                   alt,
                                   width = 800,
                                   height = 600,
                                   className,
                                   priority = false,
                                   quality = 85,
                                   sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
                                   onError,
                               }: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    if (hasError) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center bg-gray-100',
                    className,
                )}
                style={{ width, height }}
            >
                <span className="text-gray-400 text-sm">Image failed to load</span>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden">
            {isLoading && (
                <Skeleton
                    className={cn('absolute inset-0 z-10', className)}
                    style={{ width, height }}
                />
            )}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={cn(
                    'transition-opacity duration-300',
                    isLoading ? 'opacity-0' : 'opacity-100',
                    className,
                )}
                priority={priority}
                quality={quality}
                sizes={sizes}
                onLoad={() => setIsLoading(false)}
                onError={handleError}
                loading={priority ? 'eager' : 'lazy'}
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                placeholder="blur"
            />
        </div>
    );
}