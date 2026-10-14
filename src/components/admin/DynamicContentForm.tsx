'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface DynamicContentFormProps {
    content: any;
    onChange: (newContent: any) => void;
}

export default function DynamicContentForm({ content, onChange }: DynamicContentFormProps) {
    const handleChange = (key: string, value: any) => {
        onChange({ ...content, [key]: value });
    };

    const renderInput = (key: string, value: any) => {
        // 1. Long Text (Textarea)
        if (typeof value === 'string' && (value.length > 50 || key.includes('description') || key.includes('text') || key.includes('bio'))) {
            return (
                <textarea
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                />
            );
        }

        // 2. Boolean (Toggle)
        if (typeof value === 'boolean') {
            return (
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={() => handleChange(key, !value)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 ${value ? 'bg-slate-900' : 'bg-gray-200'}`}
                    >
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>
                    <span className="ml-3 text-sm text-gray-700">{value ? 'Enabled' : 'Disabled'}</span>
                </div>
            );
        }

        // 3. Array (List Editor) - Assuming array of strings for now
        if (Array.isArray(value)) {
            return (
                <div className="space-y-2">
                    {value.map((item: any, index: number) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                                value={item}
                                onChange={(e) => {
                                    const newArray = [...value];
                                    newArray[index] = e.target.value;
                                    handleChange(key, newArray);
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newArray = value.filter((_, i) => i !== index);
                                    handleChange(key, newArray);
                                }}
                                className="text-red-500 hover:text-red-700 p-2"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleChange(key, [...value, ''])}
                        className="text-sm text-slate-900 hover:text-slate-800 font-medium flex items-center gap-1"
                    >
                        <Plus size={14} /> Add Item
                    </button>
                </div>
            );
        }

        // 4. Default String Input
        return (
            <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                value={value || ''}
                onChange={(e) => handleChange(key, e.target.value)}
            />
        );
    };

    return (
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Page Content Editor</h3>
            {Object.keys(content).length === 0 && (
                <div className="text-sm text-gray-500 italic">No content fields defined for this page yet. Add them in the database or seed file first.</div>
            )}
            {Object.entries(content).map(([key, value]) => (
                <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key.replace(/_/g, ' ')}
                    </label>
                    {renderInput(key, value)}
                </div>
            ))}
        </div>
    );
}
