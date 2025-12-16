const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

// ===================================
// Server Configuration
// ===================================
const app = express();
const PORT = 3000;
const RESPONSES_FILE = path.join(__dirname, 'responses.json');

// ===================================
// Middleware
// ===================================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// ===================================
// Initialize Responses File
// ===================================
async function initializeResponsesFile() {
    try {
        await fs.access(RESPONSES_FILE);
    } catch (error) {
        // File doesn't exist, create it
        await fs.writeFile(RESPONSES_FILE, JSON.stringify([], null, 2));
        console.log('Created responses.json file');
    }
}

// ===================================
// API Endpoints
// ===================================

// GET - Retrieve all RSVP responses (for admin view)
app.get('/api/rsvp', async (req, res) => {
    try {
        const data = await fs.readFile(RESPONSES_FILE, 'utf8');
        const responses = JSON.parse(data);
        res.json({
            success: true,
            count: responses.length,
            responses: responses
        });
    } catch (error) {
        console.error('Error reading responses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve responses'
        });
    }
});

// POST - Submit new RSVP
app.post('/api/rsvp', async (req, res) => {
    try {
        const { name, response, timestamp } = req.body;

        // Validate input
        if (!name || !response || !timestamp) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, response, timestamp'
            });
        }

        if (response !== 'yes' && response !== 'no') {
            return res.status(400).json({
                success: false,
                message: 'Response must be either "yes" or "no"'
            });
        }

        // Read existing responses
        const data = await fs.readFile(RESPONSES_FILE, 'utf8');
        const responses = JSON.parse(data);

        // Check for duplicate submission (same name) - Upsert logic
        const existingIndex = responses.findIndex(r => r.name.toLowerCase() === name.toLowerCase());

        if (existingIndex !== -1) {
            // Update existing response
            responses[existingIndex] = {
                ...responses[existingIndex],
                response: response,
                timestamp: timestamp,
                updatedAt: new Date().toISOString()
            };

            await fs.writeFile(RESPONSES_FILE, JSON.stringify(responses, null, 2));
            console.log(`RSVP updated: ${name} - ${response}`);

            return res.json({
                success: true,
                message: 'RSVP updated successfully',
                response: responses[existingIndex]
            });
        }

        // Add new response
        const newResponse = {
            id: responses.length + 1,
            name: name.trim(),
            response: response,
            timestamp: timestamp,
            submittedAt: new Date().toISOString()
        };

        responses.push(newResponse);

        // Save to file
        await fs.writeFile(RESPONSES_FILE, JSON.stringify(responses, null, 2));

        console.log(`New RSVP received: ${name} - ${response}`);

        res.json({
            success: true,
            message: 'RSVP submitted successfully',
            response: newResponse
        });

    } catch (error) {
        console.error('Error submitting RSVP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit RSVP'
        });
    }
});

// GET - Statistics endpoint
app.get('/api/stats', async (req, res) => {
    try {
        const data = await fs.readFile(RESPONSES_FILE, 'utf8');
        const responses = JSON.parse(data);

        const stats = {
            total: responses.length,
            attending: responses.filter(r => r.response === 'yes').length,
            notAttending: responses.filter(r => r.response === 'no').length
        };

        res.json({
            success: true,
            stats: stats
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve statistics'
        });
    }
});

// ===================================
// Start Server
// ===================================
async function startServer() {
    await initializeResponsesFile();

    app.listen(PORT, () => {
        console.log('=================================');
        console.log('🎉 Birthday Invitation Server');
        console.log('=================================');
        console.log(`Server running at: http://localhost:${PORT}`);
        console.log(`View invitation: http://localhost:${PORT}/index.html`);
        console.log(`API endpoint: http://localhost:${PORT}/api/rsvp`);
        console.log(`Statistics: http://localhost:${PORT}/api/stats`);
        console.log('=================================');
    });
}

startServer();
