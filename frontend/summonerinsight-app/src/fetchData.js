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
        if (settings.TagLine.toLowerCase()===settings.RegionTag) {
            console.log('You must enter your tags using the format #0000 or select the right region')
        } else {
            console.error(`Error: ${response.statusText}`);
        }
    } else {
        return await response.json();
    }
}