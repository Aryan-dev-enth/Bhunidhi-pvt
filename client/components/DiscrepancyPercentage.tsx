import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface DiscrepancyPercentageProps {
  percentage: number
}

export function DiscrepancyPercentage({ percentage }: DiscrepancyPercentageProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < percentage) {
        setCount(prev => Math.min(prev + 1, percentage))
      }
    }, 20)

    return () => clearTimeout(timer)
  }, [count, percentage])

  return (
    <motion.div
      className="text-4xl font-bold text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-primary">{count}%</span> Discrepancy
    </motion.div>
  )
}

