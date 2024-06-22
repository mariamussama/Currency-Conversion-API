const currencyService = require('../src/currencyService');
const axios = require('axios');
const cache = require('../src/cache');
const { API_URL, API_TOKEN } = require('../src/config');

jest.mock('axios');
jest.mock('../src/cache');

describe('currencyService', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return exchange rates from cache if available', async () => {
        const cachedRates = { inr_usd: 0.012085 };
        cache.get.mockReturnValue(cachedRates);

        const rates = await currencyService.convertCurrency('inr', ['usd']);
        expect(rates).toEqual(cachedRates);
        expect(cache.get).toHaveBeenCalledWith('inr_usd_today');
    });

    it('should fetch exchange rates from API if not in cache', async () => {
        cache.get.mockReturnValue(null);
        axios.post.mockResolvedValue({
            data: {
                inr_usd: 0.012085,
            },
        });
        cache.set.mockReturnValue(true);

        const rates = await currencyService.convertCurrency('inr', ['usd']);
        expect(rates).toEqual({ inr_usd: 0.012085 });
        expect(axios.post).toHaveBeenCalledWith(
            API_URL,
            { source: 'inr', targets: ['usd'], date: undefined },
            { headers: { 'Content-Type': 'application/json', 'apy-token': API_TOKEN } }
        );
        expect(cache.set).toHaveBeenCalledWith('inr_usd_today', { inr_usd: 0.012085 }, 86400);
    });
});
