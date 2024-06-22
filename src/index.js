const express = require('express');
const currencyService = require('./currencyService');
const cache = require('./cache');
const { swaggerUi, specs } = require('./swagger');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const rateLimiter = new RateLimiterMemory({
    points: 10, // 10 requests
    duration: 1, // per 1 second by IP
});

/**
 * @swagger
 * /convert:
 *   post:
 *     summary: Convert currency to multiple target currencies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - source
 *               - targets
 *             properties:
 *               source:
 *                 type: string
 *                 example: inr
 *               targets:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["usd", "aed", "eur"]
 *               date:
 *                 type: string
 *                 example: "2023-06-20"
 *     responses:
 *       200:
 *         description: Conversion rates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: number
 *                 example: 0.012085
 *       400:
 *         description: Missing or invalid request parameters
 *       429:
 *         description: Too Many Requests
 *       500:
 *         description: Internal server error
 */
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
    console.log(`Currency Conversion API is running on port ${port}`);
});
