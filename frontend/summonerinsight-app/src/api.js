import { regions, ddragonChampionSpecificPath } from "./constants";

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
            "Access-Control-Allow-Origin": "http://172.28.183.213:5151"
        },
        body: JSON.stringify(settings)
    });
    isFetching.current = false;
    if (response.statusText === "Too Many Requests") {
        throw new Error('Too many requests. Please try again in a few seconds.');
    }
    if (response.statusText === "Not Found") {
        throw new Error('Please enter your tag numbers using the format #0000 or select the right region.');
    }
    if (!response.ok) {
        throw new Error('An error occurred while fetching data.');
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