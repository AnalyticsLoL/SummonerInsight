import { regions, ddragonChampionSpecificPath, errors } from "./constants";

export const fetchAPIData = async (url, settings, isFetching) => {
    isFetching.current = true;
    if(!settings.Region){
        settings.Region = regions.find(region => region.regionTag === settings.RegionTag.toUpperCase()).regionRoute;
    }
    console.log('Sending request to: '+url);

    const response = await fetch(url, {
        method:'POST',
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://dev.summonerinsight.com:5151"
        },
        body: JSON.stringify(settings)
    });
    isFetching.current = false;
    if (!response.ok) {
        if (errors.find(error => error.statusText === response.statusText)){
            throw new Error(errors.find(error => error.statusText === response.statusText).message);
        } else {
            throw new Error('An error occurred while fetching data.');
        }
    }
    return await response.json();
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
