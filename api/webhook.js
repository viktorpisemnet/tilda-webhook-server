export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Webhook received:', req.body);

    const {
      Name,
      Street_Address,
      City,
      State,
      ZIP_Code,
      Email,
      Phone
    } = req.body;

    const shippo = require('shippo')(process.env.SHIPPO_LIVE_TOKEN);

    const orderData = {
      address_to: {
        name: Name,
        street1: Street_Address,
        city: City,
        state: State,
        zip: ZIP_Code,
        country: 'US',
        email: Email,
        phone: Phone
      },
      parcels: [
        {
          length: "10",
          width: "10",
          height: "5",
          distance_unit: "in",
          weight: "2",
          mass_unit: "lb"
        }
      ],
      async: false
    };

    try {
      const shipment = await shippo.shipment.create(orderData);
      console.log('Shipment created:', shipment);
      res.status(200).json({ message: 'Webhook received and shipment created successfully!' });
    } catch (error) {
      console.error('Error creating shipment:', error);
      res.status(500).json({ message: 'Error creating shipment', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
