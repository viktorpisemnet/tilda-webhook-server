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
      ZIP_Code,
      Country = 'United States' // новая страна, дефолт USA если не заполнено
    } = req.body;

    const shippoToken = process.env.SHIPPO_API_KEY;

    if (!shippoToken) {
      console.error('Shippo API Key not found in environment variables.');
      return res.status(500).json({ error: 'Shippo API Key not configured.' });
    }

    const orderData = {
      address_from: {
        name: 'Sub-Zero & Wolf Repair Service',
        street1: '26551 Crestview Dr, #610',
        city: 'Idyllwild',
        state: 'CA',
        zip: '92549',
        country: 'US',
        email: 'info@subzeroparts.com',
        phone: '8054298885'
      },
      address_to: {
        name: Name,
        street1: Street_Address,
        city: City,
        state: State,
        zip: ZIP_Code,
        country: Country,
        email: Email,
        phone: Phone
      },
    parcels: [
  {
    length: '34',
    width: '18',
    height: '2',
    distance_unit: 'in',
    weight: '3',
    mass_unit: 'lb'  // Shippo ждёт это поле отдельно
  }
]
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
      console.log('Shippo Order created:', data);

      res.status(200).json({ message: 'Order created successfully', data });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
