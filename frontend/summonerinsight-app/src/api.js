import { regions, ddragonChampionGlobalPath, ddragonItemPath } from "./constants";

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
}

export const fetchChampionData = async (championId, setIsFetching) => {
    setIsFetching(true);
    try {
        let response = await fetch(ddragonChampionGlobalPath);
        response = await response.json();
        return Object.values(response.data).find(champion => champion.key === championId.toString());
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
}

export const fetchItemData = async (itemId, setIsFetching) => {
    setIsFetching(true);
    try {
        let response = await fetch(`${ddragonItemPath}`);
        response = await response.json();
        return response.data[itemId];
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
}