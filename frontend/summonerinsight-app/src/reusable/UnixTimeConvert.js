export const getDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m${seconds}s`;
}
export const getTimeDifference = (time) => {
    const differenceMilliseconds = Date.now() - time;
    const differenceMinutes = Math.floor(differenceMilliseconds / 60000);
    // Define time units and their thresholds
    const timeUnits = [
        { unit: 'year', value: 12 * 30 * 24 * 60 },
        { unit: 'month', value: 30 * 24 * 60 },
        { unit: 'week', value: 7 * 24 * 60 },
        { unit: 'day', value: 24 * 60 },
        { unit: 'hour', value: 60 },
        { unit: 'minute', value: 1 }
    ];
    for (const { unit, value } of timeUnits) {
        if (differenceMinutes >= value) {
            const count = Math.floor(differenceMinutes / value);
            return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
        }
    }
    return 'just now';
};