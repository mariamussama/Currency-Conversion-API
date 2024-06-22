const axios = require('axios');
const cache = require('./cache');
const { API_URL, API_TOKEN } = require('./config');

const convertCurrency = async (source, targets, date) => {
    const cacheKey = `${source}_${targets.join('_')}_${date || 'today'}`;
    const cachedRates = cache.get(cacheKey);

    if (cachedRates) {
        return cachedRates;
    }

    try {
        const response = await axios.post(API_URL, {
            source,
            targets,
            date,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'apy-token': API_TOKEN,
            },
        });

        const rates = response.data;
        cache.set(cacheKey, rates, 86400); // Cache for 1 day

        return rates;
    } catch (error) {
        throw new Error('Failed to fetch conversion rates.');
    }
};

module.exports = {
    convertCurrency,
};
