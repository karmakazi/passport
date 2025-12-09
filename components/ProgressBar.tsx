'use client'

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">
          {current} of {total} stamps collected
        </span>
        <span className="text-sm font-bold text-primary-600">
          {Math.round(percentage)}%
        </span>
      </div>
      
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {percentage === 100 && (
        <div className="mt-2 text-center text-sm font-semibold text-accent-600 animate-bounce-in">
          All stamps collected! Ready to enter the contest!
        </div>
      )}
    </div>
  )
}

