import { regions, ddragonChampionSpecificPath } from "./constants";

export const fetchAPIData = async (url, settings, isFetching) => {
    isFetching.current = true;
    if(!settings.Region){
        settings.Region = regions.find(region => region.regionTag === settings.RegionTag.toUpperCase()).regionRoute;
    }
    console.log('Sending request to: '+url);
    try {
        const response = await fetch(url, {
            method:'POST',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://dev.summonerinsight.com:5151"
            },
            body: JSON.stringify(settings)
        });
        isFetching.current = false;
        return await response.json();
    } catch (error) {
        isFetching.current = false;
        throw new Error(`Please enter your tag numbers using the format #0000 or select the right region.`);
    }
};

export const fetchChampionData = async (championName) => {
    try {
        const response = await fetch(`${ddragonChampionSpecificPath}/${championName}.json`);
        const data = await response.json();
        return data.data[championName];
    } catch (error) {
        throw new Error(error.message);
    }
}
