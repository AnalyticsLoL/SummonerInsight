import { regions } from "./constants";

export const fetchData = async (url, settings, setIsLoading) => {

    setIsLoading(true);
    if(!settings.RegionRoute){
        settings.Region = regions.find(region => region.regionTag === settings.RegionTag.toUpperCase()).regionRoute;
    }
    console.log('Sending request to: '+url);
    try {
        const response = await fetch(url, {
            method:'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(settings)
        });
        setIsLoading(false);
        return await response.json();
    } catch (error) {
        setIsLoading(false);
        throw new Error(`Error: ${error}`);
    }
}