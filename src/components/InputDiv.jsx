import { forwardRef, useId } from 'react';
import { Label, Input } from '@/components/Index';

const InputDiv = forwardRef(function input(
  { label, className = '', type = 'text', placeholder = '', ...props },
  ref
) {
  const id = useId();
  return (
    <div className={`grid w-full items-center gap-1.5 my-3 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default InputDiv;
