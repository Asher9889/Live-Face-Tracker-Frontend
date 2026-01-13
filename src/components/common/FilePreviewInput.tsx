// FilePreviewInput.tsx
import React, { useEffect, useMemo } from "react";
// import { Controller } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

// type Props = {
//   name: string;
//   control: any; // from useForm().control
//   maxFiles?: number;
//   accept?: string;
//   boxSize?: number; // px
//   label?: React.ReactNode;
// };

type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  maxFiles?: number;
  accept?: string;
  boxSize?: number;
  label?: React.ReactNode;
};

export default function FilePreviewInput<T extends FieldValues>({
  name,
  control,
  maxFiles = 10,
  accept = "image/*",
  boxSize = 88,
  label,
}: Props<T>) {
  return (
    <Controller 
      name={name} 
      control={control}
      defaultValue={[] as any}
      render={({ field: { value = [], onChange, ref }, fieldState }) => {
        // value will be an array of File objects
        // convert FileList or File[] to normalized File[] 
        const files: File[] = Array.isArray(value)
          ? value
          : value
          ? Array.from(value as FileList)
          : [];

        // create preview URLs for images; revoke on cleanup
        const previews = useMemo(() => {
          return files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [files.map((f) => f.name + f.size + f.lastModified).join("|")]);

        useEffect(() => {
          return () => {
            previews.forEach((p) => URL.revokeObjectURL(p.url));
          };
        }, [previews]);

        const handleFiles = (fileList: FileList | null) => {
          if (!fileList) return;
          const incoming = Array.from(fileList);
          const combined = [...files, ...incoming].slice(0, maxFiles);
          onChange(combined);
        };

        const handleRemove = (index: number) => {
          const next = files.filter((_, i) => i !== index);
          onChange(next);
        };

        const handleClearAll = () => {
          onChange([]);
        };

        return (
          <div className="w-full">
            {label && <label className="block text-sm font-medium mb-2">{label}</label>}

            <div className="flex items-start gap-4">
              {/* preview grid */}
              <div className="grid grid-cols-3 gap-3" style={{ minWidth: 0 }}>
                {previews.map((p, idx) => (
                  <div
                    key={p.url}
                    className="relative rounded-md overflow-hidden border bg-white"
                    style={{ width: boxSize, height: boxSize }}
                  >
                    <img
                      src={p.url}
                      alt={p.file.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />

                    {/* small remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      aria-label={`Remove ${p.file.name}`}
                      className="absolute w-4 h-4  top-1 right-2 bg-white/90 text-sm rounded-full shadow-sm hover:bg-white"
                      style={{ transform: "translate(30%, -30%)" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* empty boxes placeholder until maxFiles */}
                {Array.from({ length: Math.max(0, Math.min(maxFiles - previews.length, 5)) }).map(
                  (_, i) => (
                    <div
                      key={"empty-" + i}
                      className="rounded-md border dashed border-gray-200 bg-gray-50 flex items-center justify-center text-center text-xs text-gray-400"
                      style={{ width: boxSize, height: boxSize }}
                    >
                      {previews.length === 0 && i === 0 ? "No image selected" : ""}
                    </div>
                  )
                )}
              </div>

              {/* file controls */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${name}-input`}
                  className="gap-2 px-6 py-2 bg-blue-600 text-white text-center rounded-md cursor-pointer hover:bg-blue-700"
                >
                  {files.length > 0 ? "Add more" : "Choose photo(s)"}
                </label>

                <input
                  id={`${name}-input`}
                  ref={ref}
                  type="file"
                  accept={accept}
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    // reset the input so same file can be selected again if removed
                    e.currentTarget.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                >
                  Remove all
                </button>

                <p className="text-xs text-muted-foreground max-w-xs">
                  {files.length}/{maxFiles} selected
                </p>

                {fieldState.error && (
                  <p className="text-xs text-red-500">{String(fieldState.error.message)}</p>
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
