export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const datevalues = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    ];

    return `${padZero(datevalues[0], 4)}/${padZero(datevalues[1])}/${padZero(datevalues[2])} ${padZero(datevalues[3])}:${padZero(datevalues[4])}:${padZero(datevalues[5])}`
}

const padZero = (val, len = 2) => `${val}`.padStart(len, `0`);