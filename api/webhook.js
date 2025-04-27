export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Webhook received:', req.body);

    const shippoToken = process.env.SHIPPO_API_KEY;

    try {
      const response = await fetch('https://api.goshippo.com/addresses/', {
        method: 'POST',
        headers: {
          'Authorization': `ShippoToken ${shippoToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "John Doe",
          street1: "6512 Greene Rd.",
          city: "Woodridge",
          state: "IL",
          zip: "60517",
          country: "US",
          phone: "+1 555 341 9393",
          email: "johndoe@example.com"
        })
      });

      const data = await response.json();
      console.log('Shippo address created:', data);

      res.status(200).json({ message: 'Address created successfully', data });
    } catch (error) {
      console.error('Error creating address:', error);
      res.status(500).json({ error: 'Failed to create address' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
