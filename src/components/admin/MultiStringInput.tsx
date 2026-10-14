import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface MultiStringInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    label?: string;
    description?: string;
}

export default function MultiStringInput({
    value = [],
    onChange,
    placeholder = '',
    label,
    description
}: MultiStringInputProps) {
    const handleChange = (index: number, newValue: string) => {
        const newArray = [...value];
        newArray[index] = newValue;
        onChange(newArray);
    };

    const handleAdd = () => {
        onChange([...value, '']);
    };

    const handleRemove = (index: number) => {
        const newArray = value.filter((_, i) => i !== index);
        onChange(newArray);
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            {description && (
                <p className="text-sm text-gray-500 mb-2">{description}</p>
            )}

            <div className="space-y-4">
                {value.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start group">
                        <textarea
                            rows={4}
                            className="flex-grow px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700 font-mono text-xs"
                            value={item}
                            onChange={(e) => handleChange(index, e.target.value)}
                            placeholder={placeholder}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                            title="Remove"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-2 text-sm text-slate-900 hover:text-slate-700 font-medium mt-2"
            >
                <Plus size={16} />
                Add SVG Code
            </button>
        </div>
    );
}
