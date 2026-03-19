// server.js - Simple working API
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/generate-card', (req, res) => {
    try {
        const { cardholderName, cardNumber, expDate } = req.body;
        
        console.log('Received:', { cardholderName, cardNumber, expDate });
        
        res.json({
            success: true,
            message: 'Card data received!',
            data: { name: cardholderName, number: cardNumber, expiry: expDate }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/', (req, res) => {
    res.send('PAYRA Card API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});
