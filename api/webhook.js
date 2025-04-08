import { Shippo } from 'shippo';
import 'dotenv/config';

// Инициализация Shippo SDK
const shippo = new Shippo({
  apiKeyHeader: process.env.SHIPPO_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const data = req.body;

  // Поддержка fallback на разные имена полей
  const name = data.Name || data.name || 'No Name';
  const email = data.Email || data.email || '';
  const phone = data.Phone || data.phone || '';
  const street1 = data.street1 || 'To be filled manually';
  const street2 = data.street2 || '';
  const city = data.city || 'To be filled manually';
  const state = data.state || 'CA';
  const zip = data.zip || '00000';
  const country = data.country || 'US';

  // Создание Shippo адреса получателя
  let toAddressId;

  try {
    const toAddress = await shippo.addresses.create({
      name,
      street1,
      street2,
      city,
      state,
      zip,
      country,
      phone,
      email,
      validate: true
    });

    toAddressId = toAddress.object_id;
    console.log('Created recipient address:', toAddressId);
  } catch (error) {
    console.error('Error creating address:', error);
    return res.status(500).send('Address creation failed');
  }

  // Адрес отправителя (ваш склад/офис)
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

  // Базовые размеры и вес посылки
  const parcel = {
    length: '34',
    width: '18',
    height: '2',
    distance_unit: 'in',
    weight: '3',
    mass_unit: 'lb'
  };

  // Создание отправления
  try {
    const shipment = await shippo.shipments.create({
      address_from: fromAddress,
      address_to: toAddressId,
      parcels: [parcel],
      async: false
    });

    console.log('Shipment created:', shipment.object_id);
  } catch (error) {
    console.error('Error creating shipment:', error);
    return res.status(500).send('Shipment creation failed');
  }

  // Ответ Tilda
  return res.status(200).send('OK');
}
