import { Bell } from 'lucide-react'
import { DroneStatus } from './drone-status'
import { ModeToggle } from './mode-toggle';


export function Navbar() {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
       
       <a href="/"> <img src="bhunidhi-logo.png" alt="" /></a>
       
      </div>
      <div className="flex items-center gap-6">
        <DroneStatus busy={3} available={2} />
        <button className="rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
          <Bell className="h-5 w-5" />
        </button>
        <ModeToggle />
      </div>
    </header>
  )
}
