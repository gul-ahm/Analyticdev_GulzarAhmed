'use client';

import { X, Maximize2, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useScroll } from '@/components/public/ScrollContext';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker robustly
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface PdfReaderProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    title: string;
}

export default function PdfReader({ isOpen, onClose, pdfUrl, title }: PdfReaderProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const { lenis } = useScroll();

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            if (lenis) lenis.stop();
            document.body.style.overflow = 'hidden';
            setPageNumber(1);
            setScale(1.0);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            if (lenis) lenis.start();
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen, lenis]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const changePage = (offset: number) => {
        setPageNumber(prevPageNumber => Math.min(Math.max(1, prevPageNumber + offset), numPages || 1));
    };

    const changeScale = (delta: number) => {
        setScale(prevScale => Math.min(Math.max(0.5, prevScale + delta), 2.0));
    };

    if (!isVisible && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isOpen ? 'opacity-100 backdrop-blur-lg bg-slate-950/80' : 'opacity-0 backdrop-blur-none bg-transparent'
                }`}
            onClick={onClose}
        >
            <div
                className={`w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/50 transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <a
                                href={pdfUrl}
                                download
                                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                title="Download PDF"
                            >
                                <Download size={20} />
                            </a>
                        </div>
                        <div className="h-6 w-px bg-gray-200" />
                        <div>
                            <h3 className="text-md font-bold text-slate-800 leading-tight max-w-[200px] sm:max-w-md truncate">{title}</h3>
                            <p className="text-xs text-slate-500 font-medium">Page {pageNumber} of {numPages || '--'}</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100/80 transition-colors text-slate-500 hover:text-red-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-slate-50 border-b border-gray-200 px-6 py-2 flex items-center justify-center gap-4">
                    <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                        <button
                            disabled={pageNumber <= 1}
                            onClick={() => changePage(-1)}
                            className="p-1.5 rounded-md hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm font-medium text-slate-600 w-16 text-center">
                            {pageNumber} / {numPages}
                        </span>
                        <button
                            disabled={pageNumber >= (numPages || 1)}
                            onClick={() => changePage(1)}
                            className="p-1.5 rounded-md hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1 hidden sm:flex">
                        <button onClick={() => changeScale(-0.1)} className="p-1.5 rounded-md hover:bg-slate-50 text-slate-600">
                            <ZoomOut size={18} />
                        </button>
                        <span className="text-sm font-medium text-slate-600 w-12 text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <button onClick={() => changeScale(0.1)} className="p-1.5 rounded-md hover:bg-slate-50 text-slate-600">
                            <ZoomIn size={18} />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer Body */}
                <div
                    className="flex-1 bg-slate-100 overflow-y-auto flex justify-center p-8 relative"
                    data-lenis-prevent // Critical: Tells Lenis to ignore this element's scroll
                >
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="shadow-2xl"
                        loading={
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                                    <p className="text-sm">Loading Research...</p>
                                </div>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="bg-white"
                            width={Math.min(800, window.innerWidth - 64)} // Responsive width
                        />
                    </Document>
                </div>
            </div>
        </div>
    );
}
