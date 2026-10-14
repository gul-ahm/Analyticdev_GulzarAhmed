'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    maxFiles?: number;
}

export default function ImageUpload({ value = [], onChange, maxFiles = 5 }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset
        setError('');
        setIsUploading(true);

        // Validation
        if (file.size > 20 * 1024 * 1024) {
            setError('File too large (max 20MB)');
            setIsUploading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                // Determine layout: if single file allowed (conceptually) or just append
                // Logic: Append new URL to array
                const newUrls = [...value, data.url];
                onChange(newUrls);
            } else {
                setError(data.error || 'Upload failed');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong');
        } finally {
            setIsUploading(false);
            // Clear input so same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove));
    };

    return (
        <div className="space-y-4">
            {/* Image List */}
            <div className="flex flex-wrap gap-4 mb-4">
                {value.map((url, index) => (
                    <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
                        <div className="absolute top-1 right-1 z-10 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                            onClick={() => handleRemove(url)}>
                            <X className="w-4 h-4 text-white" />
                        </div>
                        <Image
                            src={url}
                            alt={`Uploaded ${index}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Upload Button */}
            {value.length < maxFiles && (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className={`
                            flex items-center justify-center w-full md:w-auto px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg 
                            text-sm font-medium text-gray-600 hover:border-slate-700 hover:text-slate-700 transition-colors
                            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Image
                            </>
                        )}
                    </button>
                    {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                </div>
            )}

            <p className="text-xs text-gray-400">
                Supported: JPG, PNG, WEBP. Max 20MB.
            </p>
        </div>
    );
}
