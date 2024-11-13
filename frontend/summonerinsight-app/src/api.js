import { regions, ddragonChampionGlobalPath, ddragonItemPath } from "./constants";

export const fetchAPIData = async (url, settings, setIsLoading) => {
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

export const fetchChampionData = async (championId, isLoading) => {
    isLoading.current = true;
    console.log(`Fetching champion data from: ${ddragonChampionGlobalPath}`);
    try {
        let response = await fetch(ddragonChampionGlobalPath);
        isLoading.current = false;
        response = await response.json();
        return Object.values(response.data).find(champion => champion.key === championId.toString());
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
}

export const fetchItemData = async (itemId, isLoading) => {
    isLoading.current = true;
    console.log(`Fetching item data from: ${ddragonItemPath}`);
    try {
        let response = await fetch(`${ddragonItemPath}`);
        isLoading.current = false;
        response = await response.json();
        return response.data[itemId];
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
}