import { regions } from "./constants";

export const fetchData = async (url, settings, setIsLoading) => {

    setIsLoading(true);
    if(!settings.RegionRoute){
        settings.Region = regions.find(region => region.regionTag === settings.RegionTag.toUpperCase()).regionRoute;
    }
    console.log('Sending request to: '+url);
    let response = await fetch(url, {
        method:'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(settings)
    });
    setIsLoading(false);
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    } else {
        return await response.json();
    }
}