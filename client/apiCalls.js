import axios from "axios";

export const fetchRegions = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API}${process.env.NEXT_PUBLIC_GETALL_REGION}`
    );
    if (response.data) {
      const data = response.data;
      return data;
    }
}

export const fetchSitesMl = async (region) => {
    if (!region) return;
    
     console.log(region.title)
    const response = await axios.get(
      `https://bhoonidhi-ml.onrender.com/analyze-building-changes/?dataset_type=${region.apiId}`
    );

    if (response.data) {
        const data = response.data;
      return data
    }
  }


  export const fetchSites = async ()=>{
    const response = await axios.get("http://localhost:8000/api/site/getAll")
    return response;
  }