'use client'

import { useState, useCallback } from 'react'
import { uploadFile } from '@/lib/admin-api'
import { UploadCloud, Check, AlertCircle, Copy, X } from 'lucide-react'

export default function AdminFileUpload() {
    const [files, setFiles] = useState<{ file: File; progress: number; url?: string; error?: string }[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    // Handle drag events
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    // Handle drop event
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files)
        }
    }, [])

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files)
        }
    }

    // Process files for upload
    const handleFiles = (fileList: FileList) => {
        const newFiles = Array.from(fileList).map(file => ({
            file,
            progress: 0
        }))

        setFiles(prev => [...prev, ...newFiles])

        // Start uploading each file immediately
        newFiles.forEach(fileInfo => {
            uploadFileToServer(fileInfo.file)
        })
    }

    // Upload a file to the server
    const uploadFileToServer = async (file: File) => {
        setIsUploading(true)

        try {
            // Update progress to indicate upload started
            setFiles(prev =>
                prev.map(f =>
                    f.file === file
                        ? { ...f, progress: 10 }
                        : f
                )
            )

            // Simulate progress updates (in a real app, you'd get this from the upload API)
            const progressInterval = setInterval(() => {
                setFiles(prev => {
                    const currentFile = prev.find(f => f.file === file)
                    if (currentFile && currentFile.progress < 90 && !currentFile.url && !currentFile.error) {
                        return prev.map(f =>
                            f.file === file
                                ? { ...f, progress: Math.min(f.progress + 10, 90) }
                                : f
                        )
                    }
                    return prev
                })
            }, 300)

            // Upload file
            const response = await uploadFile(file)

            // Clear interval and update file status
            clearInterval(progressInterval)

            setFiles(prev =>
                prev.map(f =>
                    f.file === file
                        ? { ...f, progress: 100, url: response.file_url }
                        : f
                )
            )
        } catch (error: any) {
            setFiles(prev =>
                prev.map(f =>
                    f.file === file
                        ? { ...f, progress: 0, error: error.message || 'Upload failed' }
                        : f
                )
            )
        } finally {
            // Check if all files are processed
            setIsUploading(false)
        }
    }

    // Remove a file from the list
    const removeFile = (file: File) => {
        setFiles(prev => prev.filter(f => f.file !== file))
    }

    // Copy file URL to clipboard
    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url)
            .then(() => {
                alert('URL copied to clipboard')
            })
            .catch(err => {
                console.error('Failed to copy URL: ', err)
            })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">File Upload</h1>
            </div>

            {/* Upload Component */}
            <div
                className={`relative rounded-lg border-2 border-dashed p-6 ${
                    dragActive
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer rounded-md bg-white font-medium text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 hover:text-orange-500"
                        >
                            <span>Upload files</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                multiple
                                onChange={handleFileChange}
                            />
                        </label>
                        <span className="pl-1 text-gray-500">or drag and drop</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, MP4, JPG, PNG up to 10MB
                    </p>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-medium text-gray-900">Uploaded Files</h2>
                    <div className="space-y-4">
                        {files.map((fileInfo, index) => (
                            <div
                                key={`${fileInfo.file.name}-${index}`}
                                className="rounded-lg border border-gray-200 bg-white p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            {fileInfo.error ? (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                                </div>
                                            ) : fileInfo.url ? (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                                    <Check className="h-6 w-6 text-green-600" />
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200">
                                                    <div
                                                        className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500"
                                                        style={{
                                                            clipPath: `inset(0 ${100 - fileInfo.progress}% 0 0)`,
                                                            transition: 'clip-path 0.3s ease-in-out'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {fileInfo.file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(fileInfo.file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {fileInfo.url && (
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(fileInfo.url!)}
                                                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                            >
                                                <Copy className="h-5 w-5" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(fileInfo.file)}
                                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {fileInfo.error && (
                                    <div className="mt-2 text-sm text-red-600">
                                        Error: {fileInfo.error}
                                    </div>
                                )}

                                {fileInfo.url && (
                                    <div className="mt-2">
                                        <div className="flex items-center">
                                            <span className="mr-2 text-xs text-gray-500">URL:</span>
                                            <code className="rounded bg-gray-100 p-1 text-xs">{fileInfo.url}</code>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}