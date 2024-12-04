import { useQuery } from '@tanstack/react-query';
import { fetchSites } from '@/apiCalls';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface Site {
  _id: string;
  createdAt: string;
  suspectType: "system" | "user";
  geolocation: any;
  message: string;
}

export function AlertList() {
  const { data: response, error, isLoading } = useQuery({
    queryKey: ["sites"],
    queryFn: fetchSites,
  });

  if (isLoading || error) {
    return (
      <div className="space-y-3">
        <h3 className="font-medium">Alerts</h3>
        <div className="space-y-2">
          {/* Render skeletons while loading */}
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="w-full h-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const sites = response?.data as Site[];

  const latestSites: Site[] = sites
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-3">
      <h3 className="font-medium">Alerts</h3>
      <div className="space-y-2">
        {latestSites?.map((site, index) => (
          <Alert
            key={site._id} // Use the unique _id for each site
            className={`flex items-center justify-between ${
              site.suspectType === "system"
                ? "border-green-500 bg-green-50 text-green-700"
                : site.suspectType === "user"
                ? "border-red-500 bg-red-50 text-red-700"
                : "border-yellow-500 bg-yellow-50 text-yellow-700"
            }`}
          >
            <AlertDescription className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  site.suspectType === "system"
                    ? "bg-green-500"
                    : site.suspectType === "user"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              />
              Lat {site.geolocation.lat} Long {site.geolocation.lon}
            </AlertDescription>
            <button className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </Alert>
        ))}
      </div>
    </div>
  );
}
