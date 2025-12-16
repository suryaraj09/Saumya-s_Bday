const clientPromise = require('./mongodb');

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
    const client = await clientPromise;
    const db = client.db('saumya_bday');
    const collection = db.collection('rsvps');

    // GET - Retrieve all RSVP responses
    if (req.method === 'GET') {
      const responses = await collection.find({}).toArray();

      return res.status(200).json({
        success: true,
        count: responses.length,
        responses: responses
      });
    }

    // POST - Submit new RSVP or Update existing (Upsert)
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

      // Prepare data
      const rsvpData = {
        name: name.trim(),
        response: response,
        timestamp: timestamp,
        updatedAt: new Date().toISOString()
      };

      // Upsert: Update if name exists, otherwise insert
      const result = await collection.updateOne(
        { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } }, // Case-insensitive match
        { $set: rsvpData, $setOnInsert: { submittedAt: new Date().toISOString() } },
        { upsert: true }
      );

      console.log(`RSVP processed: ${name} - ${response}`);

      return res.status(200).json({
        success: true,
        message: 'RSVP submitted successfully',
        response: rsvpData
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
