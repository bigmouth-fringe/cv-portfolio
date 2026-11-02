// Adapted from shadcn/ui's MIT-licensed Native Select component.
import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

function NativeSelect({ className, children, ...props }: React.ComponentProps<'select'>) {
  return <div className="relative w-fit">
    <select data-slot="native-select" className={cn('h-10 w-full min-w-0 appearance-none rounded-md border border-input bg-background py-2 pl-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', className)} {...props}>{children}</select>
    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-60"/>
  </div>
}

function NativeSelectOption(props: React.ComponentProps<'option'>) {
  return <option data-slot="native-select-option" {...props}/>
}

export { NativeSelect, NativeSelectOption }
