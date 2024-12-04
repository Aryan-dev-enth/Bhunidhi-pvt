import * as h3 from 'h3-js';


export const checkOverlap = (boundaryCode, lat, lon) => {
      const geoh3Index = h3.latLngToCell(lat, lon, 7);

      if(geoh3Index==boundaryCode){
        return true;
      }
      else{
        false;
      }
  };