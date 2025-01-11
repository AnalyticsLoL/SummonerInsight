import { regions, ddragonChampionSpecificPath, errors } from "./constants";

export const fetchAPIData = async (url, settings, isFetching, apiFetchController) => {
    isFetching.current = true;
    if(!settings.Region){
        settings.Region = regions.find(region => region.regionTag === settings.RegionTag.toUpperCase()).regionRoute;
    }
    console.log('Sending request to: '+url);
    const signal = apiFetchController.current.signal;
    try {
        const response = await fetch(url, {
            method:'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(settings),
            signal: signal
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
    } catch (error) {
        // Handle abort error or other errors
        if (error.name === 'AbortError') {
            console.log('Fetch request was aborted.');
        } else {
            throw error;
        }
    } finally {
        isFetching.current = false;
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
