import { useDropzone } from 'react-dropzone'
import { XIcon, ArrowUpIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useToast } from './use-toast'
import { ToastAction } from './toast'
import Image from 'next/image'
import type { Attachment } from '@/lib/types'

export const readFileAsDataURL = (file: File) => {
    return new Promise<string | undefined>((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const dataURL = event?.target?.result as string | undefined
            resolve(dataURL)
        }
        reader.readAsDataURL(file)
    })
}

export default function Dropzone({
    onFileChange,
    existingAttachments = [],
}: {
    onFileChange: (files: Attachment[]) => void
    existingAttachments?: Attachment[]
}) {
    const [previews, setPreviews] = useState<Attachment[]>([])
    const { toast } = useToast()

    useEffect(() => {
        setPreviews(existingAttachments || [])
    }, [existingAttachments])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: async (droppedFiles) => {
            const acceptedFiles = droppedFiles.filter(
                (file) =>
                    (file.type === 'image/jpeg' ||
                        file.type === 'image/png' ||
                        file.type === 'application/pdf' ||
                        file.type === 'application/msword' ||
                        file.type ===
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                        file.type === 'application/vnd.ms-excel' ||
                        file.type ===
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') &&
                    file.size <= 5 * 1024 * 1024
            )

            if (acceptedFiles.length > 0) {
                const newAttachments = await Promise.all(
                    acceptedFiles.map(async (file) => {
                        const dataURL = await readFileAsDataURL(file)
                        return {
                            dataURL,
                            attachmentName: file.name,
                            type: file.type,
                        } as Attachment
                    })
                )

                setPreviews((prevPreviews) => [
                    ...prevPreviews,
                    ...newAttachments,
                ])
                onFileChange([...existingAttachments, ...newAttachments])
            } else {
                toast({
                    variant: 'destructive',
                    title: 'File size too large',
                    description:
                        'Please upload a file with a size of up to 5MB.',
                    action: (
                        <ToastAction altText="Try again">Try again</ToastAction>
                    ),
                })
            }
        },
        onDropRejected: async (fileRejections) => {
            const rejectedFiles: string = fileRejections
                .map(({ file }) => file.name)
                .join()

            toast({
                variant: 'destructive',
                title: 'File type is not allowed',
                description: `This file has an unallowed extension: ${rejectedFiles}`,
                action: (
                    <ToastAction altText="Try again">Try again</ToastAction>
                ),
            })
        },
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                ['.xlsx'],
        },
        multiple: true,
    })

    useEffect(() => {
        if (existingAttachments.length > 0) {
            setPreviews(existingAttachments)
        }
    }, [existingAttachments])

    const handleDelete = (
        event: React.MouseEvent<HTMLButtonElement>,
        index: number
    ) => {
        event.stopPropagation()
        const updatedPreviews = [...previews]
        updatedPreviews.splice(index, 1)
        setPreviews(updatedPreviews)
        const updatedFiles = existingAttachments.filter((_, i) => i !== index)
        onFileChange(updatedFiles)
    }

    return (
        <main className="pt-4">
            <div
                {...getRootProps()}
                className="dropzone border-dashed border-2 border-gray-300 p-4 flex flex-col gap-6 items-center relative cursor-pointer h-64 rounded-md flex justify-center items-center bg-hoverGrill"
                style={{ flexWrap: 'nowrap' }}
            >
                <input {...getInputProps({ name: 'file' })} />
                <div
                    className={`grid grid-cols-1 lg:grid-cols-4 py-2 w-full overflow-y-auto ${
                        previews.length === 0 && 'hidden'
                    }`}
                >
                    {previews.map((file, index) => (
                        <div
                            key={index}
                            className="relative flex items-center max-md:grid max-md:grid-cols-4 gap-2 p-2 rounded-md bg-hoverGrill shadow-lg"
                        >
                            {file.type.startsWith('image/') ? (
                                <Image
                                    src={
                                        file.dataURL.startsWith('data:')
                                            ? file.dataURL
                                            : `data:${file.type};base64,${file.dataURL}`
                                    }
                                    alt={file.attachmentName}
                                    width={15}
                                    height={15}
                                    className="object-cover rounded-md mr-1"
                                />
                            ) : (
                                <div className="w-7 h-7 bg-gray-200 rounded-md text-xl flex items-center justify-center mr-1">
                                    📄
                                </div>
                            )}
                            <p className="text-xs text-gray-600 text-ellipsis overflow-hidden">
                                {'attachmentName' in file
                                    ? file.attachmentName
                                    : (file as File).name}{' '}
                                -{' '}
                                {'dataURL' in file && file.dataURL
                                    ? Math.ceil(file.dataURL.length / 1024)
                                    : 'N/A'}{' '}
                                KB
                            </p>
                            <button
                                type="button"
                                onClick={(e) => handleDelete(e, index)}
                                className="text-white bg-red-500 opacity-80 hover:opacity-100 focus:outline-none rounded-full p-1 ml-auto"
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center justify-center">
                    <ArrowUpIcon className="h-8 w-8 fill-current mb-3" />
                    <p className="text-sm">
                        Fes clic o arrossega i solta documents (.jpg, .jpeg,
                        .png, .gif, .pdf, .doc, .docx, .xls, .xlsx).
                    </p>
                </div>
            </div>
        </main>
    )
}
