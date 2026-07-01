import {useQuery} from "@tanstack/react-query";
import api from "@/lib/api";

export interface UnitItem{
    id:number,
    name:string,
    type: "packaging" | "unit" | string;
}



export function useUnits() {
  return useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const { data } = await api.get("/units"); 
      const allUnits: UnitItem[] = data.data || data;
      
      
      console.log("Allunits", allUnits);
      
      return {
        packagingUnits: allUnits.filter((u) => u.type === "packaging"),
        subUnits: allUnits.filter((u) => u.type === "unit"),
      };
    },
    staleTime: Infinity, 
  });
}