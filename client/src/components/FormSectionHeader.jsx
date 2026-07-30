import React from 'react'

const FormSectionHeader = ({ number, title }) => {
   return (
    <div className="flex items-center gap-3">
      <span className="w-6 h-6 flex items-center justify-center bg-primary/10 border border-primary/30 text-primary font-label-mono text-[10px] shrink-0">
        {number}
      </span>
      <h2 className="font-label-mono text-[13px] text-primary uppercase tracking-widest">{title}</h2>
    </div>
  );
}

export default FormSectionHeader