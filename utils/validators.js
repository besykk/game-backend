function isPositiveNumber(value) {
    const number = Number(value);

    return !isNaN(number) && number > 0;
}

function isNonNegativeNumber(value) {
    const number = Number(value);

    return !isNaN(number) && number >= 0;
}

function isNotEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

module.exports = {
    isPositiveNumber,
    isNonNegativeNumber,
    isNotEmptyString,
};