export const countTotalWins = (matches) => {
    matches = matches.filter(match => match.win !== false);
    return matches.length;
}

export const getPlayerStats = (matches, gameName) => {
    return matches.map(match => {
        const playerStats = match.participants.find(participant => participant.gameName.toLowerCase().replace(/\s/g, '') === gameName);
        return {
            champion: {
                name: playerStats.champion.name,
                iconName: playerStats.champion.image.full
            },
            win: playerStats.win,
            kda: playerStats.kda.kda
        };
    });
}

export const getMeanKDA = (playerStats) => {
    const totalKda = playerStats.reduce((acc, match) => {
        const { name, iconName } = match.champion;
        const { win, kda } = match;

        if (!acc[name]) {
            acc[name] = {
                iconName: iconName,
                gamesPlayed: 0,
                wins: 0,
                totalKda: 0
            };
        }
        acc[name].gamesPlayed += 1;
        acc[name].wins += win ? 1 : 0;
        acc[name].totalKda += kda;

        return acc;
    }, {});

    return Object.values(totalKda).map(champion => ({
        ...champion
        ,meanKda: champion.totalKda / champion.gamesPlayed
    }));
}