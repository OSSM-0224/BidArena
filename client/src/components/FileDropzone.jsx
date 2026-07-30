import React, { useRef } from "react";

const FileDropzone = ({
  value = [],
  onChange,
  max = 4,
  label = "Upload Sensor Data",
  hint = "Drag & drop your image files (.RAW, .PNG, .JPG)",
}) => {
  const inputRef = useRef(null);

  const addFiles = (fileList) => {
    const room = Math.max(0, max - value.length);
    const incoming = Array.from(fileList)
      .slice(0, room)
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      }));
    if (incoming.length) onChange([...value, ...incoming]);
  };

  const removeFile = (id) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const emptySlots = Math.max(0, max - value.length);

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className="tech-border tech-border-tl tech-border-br border border-dashed border-outline-variant bg-surface-container-low/50 py-12 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors"
      >
        <span className="material-symbols-outlined text-primary text-[32px]">
          cloud_upload
        </span>
        <span className="font-label-mono text-[12px] text-primary uppercase tracking-widest">
          {label}
        </span>
        <span className="font-label-mono text-[10px] text-outline uppercase tracking-widest text-center px-4">
          {hint}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {value.map((item) => (
          <div
            key={item.id}
            className="relative aspect-square border border-outline-variant overflow-hidden"
          >
            <img src={item.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(item.id);
              }}
              className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-error text-on-primary text-[12px] leading-none"
              aria-label="Remove file"
            >
              ×
            </button>
          </div>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => inputRef.current?.click()}
            className="aspect-square border border-dashed border-outline-variant flex items-center justify-center text-outline hover:border-primary/50 hover:text-primary transition-colors"
          >
            +
          </button>
        ))}
      </div>
    </div>
  );
};

export default FileDropzone;
