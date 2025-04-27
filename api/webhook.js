export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Webhook received:', req.body);

    const {
      Name,
      Email,
      Phone,
      Street_Address,
      City,
      State,
      ZIP_Code
    } = req.body;

    const shippoToken = process.env.SHIPPO_API_KEY;

    const orderData = {
      address_to: {
        name: Name,
        street1: Street_Address,
        city: City,
        state: State,
        zip: ZIP_Code,
        country: 'US',
        email: Email,
        phone: Phone,
      },
      parcels: [
        {
          length: '10',
          width: '10',
          height: '10',
          distance_unit: 'in',
          weight: '1',
          mass_unit: 'lb'
        }
      ],
      async: false
    };

    try {
      const response = await fetch('https://api.goshippo.com/shipments/', {
        method: 'POST',
        headers: {
          'Authorization': `ShippoToken ${shippoToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('Shippo order created:', data);

      res.status(200).json({ message: 'Order created successfully', data });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
