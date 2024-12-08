
import { atom } from "recoil";

export const regionAtom = atom({
  key: "regionAtom", 
  default: null
  
});

export const dronesAtom = atom({
  key: 'dronesState', 
  default: [], 
});


export const droneAtom = atom({
  key: 'droneState',
  default: null
})

export const globalLoader = atom({
  key:"globalLoader",
  default: false
})