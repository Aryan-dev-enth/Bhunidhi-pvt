import * as h3 from 'h3-js';

const createSingleHexagonBoundary = (lat, lon, resolution = 6) => {
  const centerHex = h3.latLngToCell(lat, lon, resolution);
 
  return centerHex; 
};

export default createSingleHexagonBoundary;
