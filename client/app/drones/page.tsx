'use client'

import { motion } from 'framer-motion'
import { DroneList } from '@/components/drone-list'
import { Navbar } from '@/components/Navbar'
import { useRecoilValue } from 'recoil'
import { regionAtom } from '@/components/states'

export default function Home() {
  const region = useRecoilValue<any>(regionAtom);
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full z-0 opacity-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          d="M0 0l50 50 50-50M100 10s0L50 50 0 100"
        />
      </svg>
      <div className="mx-auto max-w-7xl p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm"
        >
          <Navbar />
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-semibold mb-6"
          >
            Drone Fleet Overview
          </motion.h1>
          <DroneList drones={region.drones}/>
        </motion.div>
      </div>
    </div>
  )
}
