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
import { Skeleton } from "@/components/ui/skeleton";

// Define Region type
interface Region {
  _id: string;
  title: string;
  apiId: string;
}

export function SearchLocation() {
  const [region, setRegion] = useRecoilState<any>(regionAtom);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: regions, error, isLoading } = useQuery({
    queryKey: ["region", region?.apiId],
    queryFn: fetchRegions,
  });

  const filteredRegions = regions?.filter((regionItem: Region) =>
    regionItem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegionClick = (regionItem: Region) => {
    setSelectedRegion(regionItem);
  };

  const confirmRegionSelection = () => {
    if (selectedRegion) {
      setRegion(selectedRegion);
      setSelectedRegion(null);
    }
  };

  if (isLoading) {
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
  }

  if (error) {
    return <p className="text-destructive">Failed to load regions. Please try again.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter Location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search for a location"
          className="w-full rounded-lg border-muted-foreground py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredRegions?.length > 0 ? (
          filteredRegions.map((regionItem: Region) => (
            <AlertDialog key={regionItem._id}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => handleRegionClick(regionItem)}
                  aria-label={`Select ${regionItem.title}`}
                  className="rounded-full bg-muted text-foreground hover:bg-accent focus:ring-2 focus:ring-ring"
                >
                  {regionItem.title}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Region Selection</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to select the region "{regionItem.title}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmRegionSelection}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))
        ) : (
          <p className="text-muted-foreground">No regions found. Try another search term.</p>
        )}
      </div>
    </div>
  );
}

export default SearchLocation;
