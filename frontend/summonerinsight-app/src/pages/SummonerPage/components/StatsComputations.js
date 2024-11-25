export const getNumberofWins = (matches, gameName) => {
    const playerStats = matches.map(match => {
        const playerStats = match.participants.find(participant => participant.gameName.toLowerCase().replace(/\s/g, '') === gameName);
        return {
            championId: playerStats.championId,
            win: playerStats.win,
            kda: playerStats.kda.kda
        };
    });
    return playerStats.filter(match => match.win === true).length;
}

export const getChampionsKDA = (matches, gameName) => {
    const playerStats = matches.map(match => {
        const playerStats = match.participants.find(participant => participant.gameName.toLowerCase().replace(/\s/g, '') === gameName);
        return {
            championId: playerStats.championId,
            win: playerStats.win,
            kda: playerStats.kda.kda
        };
    });
    const totalKdaPerChampion = playerStats.reduce((acc, match) => {
        const { championId, win, kda } = match;

        if (!acc[championId]) {
            acc[championId] = {
                championId,
                gamesPlayed: 0,
                wins: 0,
                totalKda: 0
            };
        }
        acc[championId].gamesPlayed += 1;
        acc[championId].wins += win ? 1 : 0;
        acc[championId].totalKda += kda;

        return acc;
    }, {});

    return Object.values(totalKdaPerChampion).map(champion => ({
        championId: champion.championId,
        gamesPlayed: champion.gamesPlayed,
        wins: champion.wins,
        meanKda: champion.totalKda / champion.gamesPlayed
    }));
}