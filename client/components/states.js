
import { atom } from "recoil";

export const regionAtom = atom({
  key: "regionAtom", 
  default: {
    _id: "674ea4bb1f95f73449eab40b",
    title: "Jindal City",
    apiId: "Jindal",
    boundaries: "873da1865ffffff",
    geolocation: [[28.937006, 77.062994]],
    drones: [
      "674ea4bb1f95f73449eab406",
      "674ea4bb1f95f73449eab407",
      "674ea4bb1f95f73449eab408",
      "674ea4bb1f95f73449eab409",
      "674ea4bb1f95f73449eab40a",
    ],
    sites: [],
    reports: [],
    createdAt: "2024-12-03T06:27:07.256Z",
    updatedAt: "2024-12-03T06:27:14.388Z",
    __v: 1,
  }
  
});

export const dronesAtom = atom({
  key: 'dronesState', 
  default: [], 
});


export const droneAtom = atom({
  key: 'droneState',
  default: null
})