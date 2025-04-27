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

    console.log('Shippo Token:', shippoToken); // Проверка: токен должен быть виден в логах!

    if (!shippoToken) {
      console.error('Shippo API Key not found in environment variables.');
      return res.status(500).json({ error: 'Shippo API Key not found' });
    }

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
          length: '10',     // длина посылки (в дюймах)
          width: '10',      // ширина посылки (в дюймах)
          height: '10',     // высота посылки (в дюймах)
          distance_unit: 'in',  // единица измерения
          weight: '1',          // вес посылки
          mass_unit: 'lb'       // единица веса
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
