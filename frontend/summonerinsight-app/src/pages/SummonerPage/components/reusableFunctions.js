export function parseDescriptionToJson(description) {
    const result = {
        stats: {},
        passive: [],
        active: []
    };

    // Match stats section and extract each line
    const statsPattern = /<stats>(.*?)<\/stats>/s;
    const statsMatch = description.match(statsPattern);
    if (statsMatch) {
        const statsText = statsMatch[1];
        const statLines = statsText.split(/<br>/).filter(line => line.trim());

        statLines.forEach(line => {
            const attentionMatch = line.match(/<attention>(\d+%?)<\/attention>\s*(.+)/);
            if (attentionMatch) {
                const [_, value, text] = attentionMatch;
                // Capitalize the first letter of each key word
                const key = text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                result.stats[key] = value.includes('%') ? value : Number(value);  // Handle % values as strings
            }
        });
    }

    // Match passive abilities and capture all occurrences
    const passivePattern = /<passive>(.*?)<\/passive>\s*<br>(.*?)(?=<br><br>|<passive>|<active>|$)/gs;
    let passiveMatch;
    while ((passiveMatch = passivePattern.exec(description)) !== null) {
        const name = passiveMatch[1].trim();
        let descriptionText = passiveMatch[2].trim();
        descriptionText = descriptionText.replace(/<[^>]+>/g, ''); // Remove any tags

        result.passive.push({
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            description: descriptionText
        });
    }

    // Match active abilities (if any)
    const activePattern = /<active>(.*?)<\/active>\s*<br>(.*?)(?=<br><br>|<active>|<passive>|$)/gs;
    let activeMatch;
    while ((activeMatch = activePattern.exec(description)) !== null) {
        const name = activeMatch[1].trim();
        let descriptionText = activeMatch[2].trim();
        descriptionText = descriptionText.replace(/<[^>]+>/g, ''); // Remove any tags

        result.active.push({
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            description: descriptionText
        });
    }

    return result;
}

export const find_positions = (matchHistory, summonerProfile) => {
    let positions = {
        "TOP": 0,
        "JUNGLE": 0,
        "MIDDLE": 0,
        "BOTTOM": 0,
        "UTILITY": 0
    };
    matchHistory.forEach(match => {
        const position = match.participants.find(participant => participant.gameName === summonerProfile.gameName).position;
        positions[position]++;
    });
    return Object.keys(positions).reduce((acc, key) => {
        if (positions[key] > 5) {
            acc[key] = positions[key];
        }
        return acc;
    }, {});
};