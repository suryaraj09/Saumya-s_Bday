const clientPromise = require('./mongodb');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db('saumya_bday');
    const collection = db.collection('rsvps');

    const total = await collection.countDocuments({});
    const attending = await collection.countDocuments({ response: 'yes' });
    const notAttending = await collection.countDocuments({ response: 'no' });

    const stats = {
      total: total,
      attending: attending,
      notAttending: notAttending
    };

    return res.status(200).json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message
    });
  }
};
