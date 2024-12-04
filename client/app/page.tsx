"use client";
import { SearchLocation } from "@/components/search-location";
import { MapView } from "@/components/map-view";

import { DroneActions } from "@/components/drone-actions";
import { AlertList } from "@/components/alert-list";
import { Navbar } from "@/components/Navbar";


export default function Home() {
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl p-4">
        <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
          <Navbar />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,400px]">
            <MapView />
            <div className="space-y-6">
              <SearchLocation />
              <div className="flex justify-center">
                <img src="/drone.png" alt="" />
              </div>
              <DroneActions />
              <AlertList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
