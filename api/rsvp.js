const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Retrieve all RSVP responses
    if (req.method === 'GET') {
      const responses = await kv.get('rsvp_responses') || [];

      return res.status(200).json({
        success: true,
        count: responses.length,
        responses: responses
      });
    }

    // POST - Submit new RSVP
    if (req.method === 'POST') {
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

      // Get existing responses
      const responses = await kv.get('rsvp_responses') || [];

      // Check for existing submission to update (Upsert)
      const existingIndex = responses.findIndex(r => r.name.toLowerCase() === name.toLowerCase());

      if (existingIndex !== -1) {
        // Update existing response
        responses[existingIndex] = {
          ...responses[existingIndex],
          response: response,
          timestamp: timestamp,
          updatedAt: new Date().toISOString()
        };
        console.log(`RSVP updated: ${name} - ${response}`);

        await kv.set('rsvp_responses', responses);

        return res.status(200).json({
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

      // Save to Vercel KV
      await kv.set('rsvp_responses', responses);

      console.log(`New RSVP received: ${name} - ${response}`);

      return res.status(200).json({
        success: true,
        message: 'RSVP submitted successfully',
        response: newResponse
      });
    }

    // PUT - Update existing RSVP
    if (req.method === 'PUT') {
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

      // Get existing responses
      const responses = await kv.get('rsvp_responses') || [];

      // Find existing response
      const existingIndex = responses.findIndex(r => r.name.toLowerCase() === name.toLowerCase());

      if (existingIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'RSVP not found. Please submit a new RSVP instead.'
        });
      }

      // Update the response
      responses[existingIndex] = {
        ...responses[existingIndex],
        response: response,
        timestamp: timestamp,
        updatedAt: new Date().toISOString()
      };

      // Save to Vercel KV
      await kv.set('rsvp_responses', responses);

      console.log(`RSVP updated: ${name} - ${response}`);

      return res.status(200).json({
        success: true,
        message: 'RSVP updated successfully',
        response: responses[existingIndex]
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });

  } catch (error) {
    console.error('Error in RSVP API:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process request',
      error: error.message
    });
  }
};
