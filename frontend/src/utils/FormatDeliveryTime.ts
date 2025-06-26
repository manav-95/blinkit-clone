
export const formatDeliveryTime = (minutes: number) => {
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} mins` : ''}`
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    return `${days} day${days !== 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours} hrs` : ''}`
}
