import React from 'react'
import { motion } from 'framer-motion'
import { IconAlertCircle } from '@tabler/icons-react'
import { useDefaultFieldContext } from './DefaultAppForm'
import { cn } from '@/utils/utils'

interface RadioFieldProps {
  label?: string
  options: Array<{
    value: string
    label: string
    prefix?: React.ReactNode
    description?: string
  }>
  orientation?: 'vertical' | 'horizontal'
  clearFieldError?: (fieldName: string) => void
  apiErrors?: Record<string, string | undefined>
  disabled?: boolean
  required?: boolean
  className?: string
}

const RadioField = ({
  label,
  options,
  // orientation = 'horizontal',
  clearFieldError = () => {},
  apiErrors = {},
  disabled = false,
  required = false,
  className,
}: RadioFieldProps) => {
  const field = useDefaultFieldContext<string>()

  const handleChange = (value: string) => {
    field.handleChange(value)
    clearFieldError(field.name)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-xs md:text-sm font-medium text-slate mb-1.5 pointer-events-none">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="flex flex-row gap-3 flex-wrap">
        {options.map((option) => (
          <motion.label
            key={option.value}
            className={cn(
              'relative flex items-center rounded-lg border-2 cursor-pointer w-40' ,
              field.state.value === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50',
              'py-2 px-3',
              disabled && 'opacity-60 cursor-not-allowed',
            )}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <input
              type="radio"
              className="sr-only"
              name={field.name}
              value={option.value}
              checked={field.state.value === option.value}
              onChange={() => handleChange(option.value)}
              disabled={disabled}
            />
            <div
              className={cn(
                'size-4 flex-shrink-0 mr-2 rounded-full border-2 flex items-center justify-center',
                field.state.value === option.value
                  ? 'border-blue-500'
                  : 'border-gray-300',
              )}
            >
              {field.state.value === option.value && (
                <motion.div
                  className="size-2.5 bg-blue-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              {option.prefix && (
                <span className="flex-shrink-0">{option.prefix}</span>
              )}
              <span className="font-medium text-gray-900">{option.label}</span>
            </div>
          </motion.label>
        ))}
      </div>

      {apiErrors[field.name] && (
        <p className="mt-1 text-sm text-rose-500 flex items-center">
          <IconAlertCircle className="size-4 mr-1" stroke={1.5} />
          {apiErrors[field.name]}
        </p>
      )}
    </div>
  )
}

export default RadioField