import { regions } from "./constants";

export const fetchAPIData = async (url, settings, setIsFetching) => {
    setIsFetching(true);
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
        setIsFetching(false);
        return await response.json();
    } catch (error) {
        setIsFetching(false);
        throw new Error(`Error: ${error}`);
    }
};