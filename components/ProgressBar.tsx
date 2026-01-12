'use client'

interface ProgressBarProps {
  current: number
  total: number
}

const REQUIRED_STAMPS = 6

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / REQUIRED_STAMPS) * 100
  const isComplete = current >= REQUIRED_STAMPS

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">
          {current} of {total} stamps collected <span className="text-gray-500">({REQUIRED_STAMPS} required)</span>
        </span>
        <span className="text-sm font-bold text-primary-600">
          {Math.min(Math.round(percentage), 100)}%
        </span>
      </div>
      
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {isComplete && (
        <div className="mt-2 text-center text-sm font-semibold text-accent-600 animate-bounce-in">
          Required stamps collected! Ready to enter the contest!
        </div>
      )}
    </div>
  )
}

