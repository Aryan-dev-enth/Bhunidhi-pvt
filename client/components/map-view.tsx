import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

import { useRecoilValue } from "recoil";
import { regionAtom } from "./states.js";



const RealTimeMap = dynamic(() => import("./Map"), { ssr: false });

export function MapView() {
  const region = useRecoilValue(regionAtom);

  const [mapMarkers, setMapMarkers] = useState<
    { position: [number, number]; popupContent: string }[]
  >([
    {
      position: [28.918521, 77.130035],
      popupContent: "Marker 1: Main Location",
    },
    {
      position: [28.928521, 77.140035],
      popupContent: "Marker 2: Nearby Point",
    },
  ]);

  const {
    data: siteData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["analyze-building-changes", region?._id], 
    queryFn: async () => {
      if (!region) return;
  
      console.log(region.title);
      const response = await axios.get(
        `https://bhoonidhi-ml.onrender.com/analyze-building-changes/?dataset_type=${region.apiId}`
      );
  
      if (response.data) {
        console.log();
        console.log(region.sites)
        if (response.data.changes && !region.sites) {
          console.log("here")
          const sites = response.data.changes;
  
          const postRequests = sites.map((site: any) =>
            axios.post(
              `${process.env.NEXT_PUBLIC_BASE_API}${process.env.NEXT_PUBLIC_CREATE_SITE_ENDPOINT}`,
              {
                geolocation: {
                  lat: site.latitude,
                  lon: site.longitude,
                },
                suspectType: "system",
              }
            )
          );
  
          const results = await Promise.allSettled(postRequests);
  
          results.forEach((result, index) => {
            if (result.status === "fulfilled") {
              console.log(`Site ${index + 1} posted successfully.`);
            } else {
              console.error(`Failed to post site ${index + 1}:`, result.reason);
            }
          });
        }
  
        return response.data;
      }
    },
    enabled: !!region,
    refetchOnWindowFocus: false,
  });
  
  useEffect(() => {
    if (siteData && siteData.changes) {
      const newMarkers = siteData.changes.map((site: any) => ({
        position: [site.latitude, site.longitude],
        popupContent: `Presence in 2021: ${site.presence_2021.toFixed(2)}`,
      }));
      setMapMarkers(newMarkers); // Update the state
    }
  }, [siteData]);

  const mapCenter: number[] = region.geolocation[0];

  return (
    <div className="relative overflow-hidden rounded-lg h-[400px] sm:h-[500px] md:h-[600px]">
      {/* Satellite Map Button */}
      <div className="absolute left-4 top-4 z-10">
        <Button variant="secondary" className="">
          {isLoading?"Loading Region...": region.title}
        </Button>
      </div>

      {/* Center Icon */}
      <div className="absolute bottom-4 right-4 z-10 rounded-full bg-white text-black p-3">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </div>

      {/* Map */}
      <div className="h-full w-full">
        
          <RealTimeMap
          isLoading= {isLoading}
            centerProp={mapCenter}
            hexagon={region.boundaries}
            zoom={14}
            markers={mapMarkers as any}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            className="rounded-lg z-0"
          />
      </div>
    </div>
  );
}