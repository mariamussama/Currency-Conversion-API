const request = require('supertest');
const express = require('express');
const currencyService = require('../src/currencyService');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const app = express();
app.use(express.json());

const rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 1,
});

app.post('/convert', (req, res) => {
    rateLimiter.consume(req.ip)
        .then(async () => {
            const { source, targets, date } = req.body;

            if (!source || !targets || !Array.isArray(targets)) {
                return res.status(400).json({ error: 'Please provide a valid "source" currency and an array of "targets" currencies.' });
            }

            try {
                const rates = await currencyService.convertCurrency(source, targets, date);
                res.json(rates);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        })
        .catch(() => {
            res.status(429).json({ error: 'Too Many Requests' });
        });
});

jest.mock('../src/currencyService');

describe('POST /convert', () => {
    it('should return 400 if source or targets are missing', async () => {
        const response = await request(app).post('/convert').send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Please provide a valid "source" currency and an array of "targets" currencies.' });
    });

    it('should return 429 if too many requests are made', async () => {
        rateLimiter.consume = jest.fn(() => Promise.reject());

        const response = await request(app).post('/convert').send({ source: 'inr', targets: ['usd'] });
        expect(response.status).toBe(429);
        expect(response.body).toEqual({ error: 'Too Many Requests' });
    });

    it('should return 500 if an error occurs while fetching rates', async () => {
        rateLimiter.consume = jest.fn(() => Promise.resolve());
        currencyService.convertCurrency.mockImplementation(() => {
            throw new Error('Failed to fetch conversion rates.');
        });

        const response = await request(app).post('/convert').send({ source: 'inr', targets: ['usd'] });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch conversion rates.' });
    });

    it('should return 200 with conversion rates if request is valid', async () => {
        rateLimiter.consume = jest.fn(() => Promise.resolve());
        currencyService.convertCurrency.mockResolvedValue({ inr_usd: 0.012085 });

        const response = await request(app).post('/convert').send({ source: 'inr', targets: ['usd'] });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ inr_usd: 0.012085 });
    });
});
