import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { regionAtom } from "./states.js";
import RegionLoader from "./global-loader.tsx";

const RealTimeMap = dynamic(() => import("./Map"), { ssr: false });


export function MapView() {
  const region = useRecoilValue<any>(regionAtom);

  const [mapMarkers, setMapMarkers] = useState<
    { position: any; popupContent: string }[]
  >([]);

  const {
    data: siteData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["analyze-building-changes", region?._id],
    queryFn: async () => {
      if (!region) return;

      const response = await axios.get(
        `https://bhoonidhi-ml.onrender.com/analyze-building-changes/?dataset_type=${region.apiId}`
      );

      if (response.data?.changes && !region.sites) {
        const sites = response.data.changes;

        // Posting new sites to the backend
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
    },
    enabled: !!region,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (region?.sites) {
      const newMarkers = region.sites.map((site: any) => ({
        position: [site.geolocation.lat, site.geolocation.lon],
        popupContent: `Presence in 2021: ${site._id}`,
      }));
      setMapMarkers(newMarkers);
    }
  }, [siteData, region?.sites]);

  const mapCenter = region?.geolocation?.[0] || [0, 0]; // Default to [0, 0] if no region or geolocation

  if (!region || isLoading) {
    return (
      <RegionLoader />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg h-[400px] sm:h-[500px] md:h-[600px]">
      {/* Satellite Map Button */}
      <div className="absolute left-4 top-4 z-10">
        <Button variant="secondary">
          {isLoading ? "Loading Region..." : region.title}
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
          isLoading={isLoading}
          centerProp={mapCenter}
          hexagon={region.boundaries}
          zoom={14}
          markers={mapMarkers}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          className="rounded-lg z-0"
        />
      </div>
    </div>
  );
}
