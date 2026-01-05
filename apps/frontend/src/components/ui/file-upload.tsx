'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, File, Image, Video, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    onUpload: (files: File[]) => void;
    multiple?: boolean;
    accept?: Record<string, string[]>;
    maxSize?: number;
    className?: string;
    label?: string;
}

const ACCEPTED_TYPES = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'video/*': ['.mp4', '.webm', '.mov'],
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt'],
    'application/json': ['.json'],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUpload({
                               onUpload,
                               multiple = false,
                               accept = ACCEPTED_TYPES,
                               maxSize = MAX_FILE_SIZE,
                               className,
                               label = 'Drag & drop files here, or click to select',
                           }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const validFiles = acceptedFiles.filter(file => {
            if (file.size > maxSize) {
                alert(`File ${file.name} is too large. Max size: ${maxSize / 1024 / 1024}MB`);
                return false;
            }
            return true;
        });

        setFiles(prev => [...prev, ...validFiles]);

        // Simulate upload progress
        validFiles.forEach(file => {
            simulateUpload(file);
        });
    }, [maxSize]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple,
        accept,
    });

    const simulateUpload = async (file: File) => {
        setIsUploading(true);

        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 10) {
            setTimeout(() => {
                setUploadProgress(prev => ({
                    ...prev,
                    [file.name]: progress,
                }));
            }, progress * 20);
        }

        // After "upload", add to parent
        setTimeout(() => {
            onUpload([file]);
            setIsUploading(false);
        }, 2500);
    };

    const removeFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileName];
            return newProgress;
        });
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) return <Image className="h-5 w-5" />;
        if (fileType.startsWith('video/')) return <Video className="h-5 w-5" />;
        if (fileType === 'application/pdf') return <FileText className="h-5 w-5" />;
        return <File className="h-5 w-5" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={cn('space-y-4', className)}>
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                    isDragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 hover:border-primary hover:bg-primary/5',
                )}
            >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">{label}</p>
                <p className="text-xs text-gray-500">
                    Max file size: {formatFileSize(maxSize)} • Supported: Images, Videos, PDFs
                </p>
                <Button type="button" variant="outline" className="mt-4">
                    Select Files
                </Button>
            </div>

            {files.length > 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {files.map((file) => (
                                <div
                                    key={file.name}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        {getFileIcon(file.type)}
                                        <div>
                                            <p className="text-sm font-medium">{file.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        {uploadProgress[file.name] !== undefined && (
                                            <div className="w-32">
                                                <Progress
                                                    value={uploadProgress[file.name]}
                                                    className="h-2"
                                                />
                                                <p className="text-xs text-gray-500 text-center mt-1">
                                                    {uploadProgress[file.name]}%
                                                </p>
                                            </div>
                                        )}

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFile(file.name)}
                                            disabled={isUploading}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}