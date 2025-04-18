const shippo = require('shippo')(process.env.SHIPPO_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    console.log('Received webhook data from Tilda:', data);

    const nameParts = data.Name ? data.Name.split(' ') : [];
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts[1] || '';

    const customer = await shippo.customer.create({
      email: data.Email || '',
      phone: data.Phone || '',
      name: data.Name || '',
      metadata: `From Tilda form ${data.formid || ''}`
    });

    console.log('Shippo customer created:', customer);

    const address = await shippo.address.create({
      name: data.Name || '',
      email: data.Email || '',
      phone: data.Phone || '',
      street1: 'To be filled manually',
      city: 'To be filled manually',
      state: 'CA',
      zip: '00000',
      country: 'US',
      metadata: `From Tilda form ${data.formid || ''}`,
      validate: false
    });

    console.log('Shippo address created:', address);

    const fromAddress = {
      name: 'SubZero Parts Warehouse',
      street1: '123 Main St',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      country: 'US',
      phone: '1234567890',
      email: 'support@subzeroparts.com'
    };

    const parcel = {
      length: '34',
      width: '18',
      height: '2',
      distance_unit: 'in',
      weight: '3',
      mass_unit: 'lb'
    };

    const shipment = await shippo.shipment.create({
      address_from: fromAddress,
      address_to: address,
      parcels: [parcel],
      async: false
    });

    console.log('Shipment created:', shipment);

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
