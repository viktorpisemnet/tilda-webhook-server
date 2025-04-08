import shippoPackage from 'shippo';
const shippo = shippoPackage(process.env.SHIPPO_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    console.log('Received webhook data from Tilda:', data);

    const nameParts = data.Name ? data.Name.split(' ') : [];
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts[1] || '';

    const address = await shippo.address.create({
      name: data.Name || '',
      email: data.Email || '',
      phone: data.Phone || '',
      street1: 'To be filled manually', // Пока нет из Tilda
      city: 'To be filled manually',
      state: 'CA',
      zip: '00000',
      country: 'US',
      metadata: `From Tilda form ${data.formid || ''}`,
      validate: false
    });

    console.log('Shippo address created:', address);

    res.status(200).json({ message: 'Webhook received and address created' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
