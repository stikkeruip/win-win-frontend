'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { FileText, FileImage, FileVideo, FilePdf, File, Play, Download, Pause } from 'lucide-react'

interface FilePreviewProps {
    fileUrl: string | undefined
    title: string
    onDownload?: () => void
    className?: string
    aspectRatio?: 'video' | 'square' | 'auto'
    maxHeight?: number
    showDownloadButton?: boolean
}

export default function FilePreview({
                                        fileUrl,
                                        title,
                                        onDownload,
                                        className = '',
                                        aspectRatio = 'video',
                                        maxHeight = 0,
                                        showDownloadButton = true
                                    }: FilePreviewProps) {
    const [fileType, setFileType] = useState<'image' | 'video' | 'pdf' | 'document' | 'unknown'>('unknown')
    const [fullUrl, setFullUrl] = useState<string | undefined>(undefined)
    const [isError, setIsError] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Determine aspect ratio class
    const getAspectRatioClass = () => {
        switch (aspectRatio) {
            case 'video':
                return 'aspect-video'
            case 'square':
                return 'aspect-square'
            default:
                return ''
        }
    }

    // Get full URL with API base URL if needed
    useEffect(() => {
        if (!fileUrl) {
            setFullUrl(undefined)
            return
        }

        try {
            // Skip processing if it's a placeholder or no-file
            if (fileUrl === 'no-file' || fileUrl.includes('placeholder')) {
                setFullUrl(undefined)
                return
            }

            // Check if it's already an absolute URL
            if (fileUrl.startsWith('http')) {
                setFullUrl(fileUrl)
            } else {
                // Add leading slash if needed
                let url = fileUrl
                if (!url.startsWith('/')) {
                    url = '/' + url
                }

                // Prefix with API base URL
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
                setFullUrl(`${API_BASE_URL}${url}`)
            }
        } catch (error) {
            console.error('Error formatting file URL:', error)
            setIsError(true)
        }
    }, [fileUrl])

    // Determine file type based on extension
    useEffect(() => {
        if (!fullUrl) {
            setFileType('unknown')
            return
        }

        try {
            // Extract the file path without query parameters
            const urlWithoutParams = fullUrl.split('?')[0]
            const extension = urlWithoutParams.split('.').pop()?.toLowerCase() || ''

            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
                setFileType('image')
            } else if (['mp4', 'webm', 'mov', 'ogg'].includes(extension)) {
                setFileType('video')
            } else if (extension === 'pdf') {
                setFileType('pdf')
            } else if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'].includes(extension)) {
                setFileType('document')
            } else {
                setFileType('unknown')
            }
        } catch (error) {
            console.error('Error determining file type:', error)
            setFileType('unknown')
        }
    }, [fullUrl])

    // Handle image load error
    const handleImageError = () => {
        console.error('Error loading image:', fullUrl)
        setIsError(true)
    }

    // Toggle video play/pause
    const toggleVideoPlayback = () => {
        if (!videoRef.current) return

        if (videoRef.current.paused || videoRef.current.ended) {
            videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(error => {
                    console.error('Error playing video:', error)
                    setIsPlaying(false)
                })
        } else {
            videoRef.current.pause()
            setIsPlaying(false)
        }
    }

    // Update isPlaying state when video plays or pauses naturally
    useEffect(() => {
        const videoElement = videoRef.current
        if (!videoElement) return

        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)
        const handleEnded = () => setIsPlaying(false)

        videoElement.addEventListener('play', handlePlay)
        videoElement.addEventListener('pause', handlePause)
        videoElement.addEventListener('ended', handleEnded)

        return () => {
            videoElement.removeEventListener('play', handlePlay)
            videoElement.removeEventListener('pause', handlePause)
            videoElement.removeEventListener('ended', handleEnded)
        }
    }, [])

    const renderFilePreview = () => {
        if (!fullUrl || isError) {
            return (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 p-4">
                    <File className="h-16 w-16 text-gray-400" />
                    <p className="mt-2 text-center text-sm text-gray-500">File preview not available</p>
                    {showDownloadButton && onDownload && (
                        <button
                            onClick={onDownload}
                            className="mt-3 flex items-center gap-1 rounded bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600"
                        >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                        </button>
                    )}
                </div>
            )
        }

        switch (fileType) {
            case 'image':
                return (
                    <div className="relative h-full w-full overflow-hidden">
                        <Image
                            src={fullUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            onError={handleImageError}
                        />
                        {showDownloadButton && onDownload && (
                            <button
                                onClick={onDownload}
                                className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-gray-800/70 px-3 py-1.5 text-xs text-white hover:bg-gray-800/90"
                            >
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                            </button>
                        )}
                    </div>
                )

            case 'video':
                return (
                    <div className="relative h-full w-full bg-black">
                        <video
                            ref={videoRef}
                            src={fullUrl}
                            className="h-full w-full"
                            preload="metadata"
                            controls
                            style={{ maxHeight: maxHeight ? `${maxHeight}px` : 'auto' }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Custom play button overlay */}
                        <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={toggleVideoPlayback}
                        >
                            {!isPlaying && (
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 text-white transition-transform hover:bg-black/60 hover:scale-110">
                                    <Play className="h-8 w-8" />
                                </div>
                            )}
                        </div>

                        {showDownloadButton && onDownload && (
                            <button
                                onClick={onDownload}
                                className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded bg-gray-800/70 px-3 py-1.5 text-xs text-white hover:bg-gray-800/90"
                            >
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                            </button>
                        )}
                    </div>
                )

            case 'pdf':
                return (
                    <div className="relative h-full w-full">
                        <iframe
                            src={`${fullUrl}#toolbar=0&navpanes=0`}
                            className="h-full w-full"
                            style={{ maxHeight: maxHeight ? `${maxHeight}px` : '100%' }}
                        ></iframe>
                        {showDownloadButton && onDownload && (
                            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gray-800/70 p-2">
                                <span className="text-xs text-white">PDF Preview</span>
                                <button
                                    onClick={onDownload}
                                    className="flex items-center gap-1 rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Download</span>
                                </button>
                            </div>
                        )}
                    </div>
                )

            case 'document':
                return (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 p-4">
                        <div className="mb-4 text-gray-400">
                            {fileType === 'document' && <FileText className="h-16 w-16" />}
                        </div>
                        <p className="text-center text-gray-600">
                            {fileType === 'document' ? 'Document preview not available' : 'File preview not available'}
                        </p>
                        {showDownloadButton && onDownload && (
                            <button
                                onClick={onDownload}
                                className="mt-3 flex items-center gap-1 rounded bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600"
                            >
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                            </button>
                        )}
                    </div>
                )

            default:
                return (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 p-4">
                        <File className="h-16 w-16 text-gray-400" />
                        <p className="mt-2 text-center text-sm text-gray-500">File available for download</p>
                        {showDownloadButton && onDownload && (
                            <button
                                onClick={onDownload}
                                className="mt-3 flex items-center gap-1 rounded bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600"
                            >
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                            </button>
                        )}
                    </div>
                )
        }
    }

    return (
        <div className={`overflow-hidden rounded-lg ${getAspectRatioClass()} ${className}`}>
            {renderFilePreview()}
        </div>
    )
}