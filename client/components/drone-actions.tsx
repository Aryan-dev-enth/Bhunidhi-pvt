'use client';
import { DrillIcon as Drone, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DroneActions() {
  const router = useRouter();
  const [confirmationType, setConfirmationType] = useState("");

  const handleDroneLocalityConfirm = () => {
    router.push("/drones");
    setConfirmationType("");
  };

  const handleAllDronesConfirm = () => {
    // Add navigation or action for all drones
    setConfirmationType("");
  };

  return (
    <div className="flex gap-3">
      <AlertDialog open={confirmationType === 'locality'}>
        <AlertDialogTrigger asChild>
          <Button 
            className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700" 
            onClick={() => setConfirmationType('locality')}
          >
            <Drone className="h-4 w-4" />
            Drone in locality
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Drone Locality</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to view drones in the locality?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmationType(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDroneLocalityConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmationType === 'allDrones'}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={() => setConfirmationType('allDrones')}
          >
            <Users className="h-4 w-4" />
            All Drone
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm All Drones</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to view all drones?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmationType(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAllDronesConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DroneActions;