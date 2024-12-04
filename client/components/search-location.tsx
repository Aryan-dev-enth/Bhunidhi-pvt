'use client';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
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
import { useQuery } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';
import { regionAtom } from './states.js';
import { fetchRegions } from '../apiCalls.js';
import { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton"


export function SearchLocation() {
  const [region, setRegion] = useRecoilState(regionAtom);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const { data: regions, error, isLoading } = useQuery({
    queryKey: ["region", region.apiId],
    queryFn: fetchRegions,
  });

  const handleRegionClick = (regionItem: any) => {
    setSelectedRegion(regionItem);
  };

  const confirmRegionSelection = () => {
    if (selectedRegion) {
      setRegion(selectedRegion);
      setSelectedRegion(null);
    }
  };

  if(isLoading){
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />

  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter Location"
          className="w-full rounded-lg border-muted-foreground py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {!isLoading && regions?.map((regionItem: any) => (
          <AlertDialog key={regionItem._id}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => handleRegionClick(regionItem)}
                className="rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400"
              >
                {regionItem.title}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Region Selection</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to select the region
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmRegionSelection}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>
    </div>
  );
}

export default SearchLocation;