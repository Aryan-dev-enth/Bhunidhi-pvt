import React from "react";
import Lottie from "react-lottie";
import animationData from "../lottie/home-animation.json";
import { Navbar } from "./Navbar";

export default function RegionLoader() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="h-full w-full flex justify-center items-center  p-8 rounded-lg shadow-xl space-y-4">
      <div className="text-center space-y-4">
       
        <Lottie options={defaultOptions} height={300} width={300} />
        <p className="text-lg text-secondary-foreground">
          Analyzing construction points.
        </p>
      </div>
    </div>
  );
}
