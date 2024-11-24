export const getChampionsStats = (matches, gameName) => {
    const playerStats = matches.map(match => {
        const playerStats = match.participants.find(participant => participant.gameName.toLowerCase().replace(/\s/g, '') === gameName);
        return {
            championId: playerStats.championId,
            win: playerStats.win,
            kda: playerStats.kda.kda
        };
    });
    const wins = playerStats.filter(match => match.win === true).length;
    const totalKda = playerStats.reduce((acc, match) => {
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

    return {
            championStats : Object.values(totalKda).map(champion => ({
            ...champion
            ,meanKda: champion.totalKda / champion.gamesPlayed
        })), 
        wins : wins
    };
}