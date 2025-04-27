export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  console.log('Webhook received:', req.body);

  const {
    Name,
    Email,
    Phone,
    Street_Address,
    City,
    State,
    ZIP_Code,
    'payment[products][0][name]': ProductName,
    'payment[products][0][quantity]': ProductQuantity
  } = req.body;

  const shippoToken = process.env.SHIPPO_API_KEY;
  if (!shippoToken) {
    console.error('Shippo API Key not found');
    return res.status(500).json({ error: 'Shippo API Key not found' });
  }

  // Адрес отправителя — ТВОЙ
  const addressFrom = {
    name: 'Sub-Zero & Wolf Repair Service',
    street1: '26551 Crestview Dr, #610',
    city: 'Idyllwild',
    state: 'CA',
    zip: '92549',
    country: 'US',
    phone: '8054298885',
    email: 'info@subzeroparts.com'
  };

  // Адрес получателя — ИЗ ЗАКАЗА
  const addressTo = {
    name: Name,
    street1: Street_Address,
    city: City,
    state: State,
    zip: ZIP_Code,
    country: 'US',
    phone: Phone,
    email: Email
  };

  const orderData = {
    to_address: addressTo,
    from_address: addressFrom,
    line_items: [
      {
        title: ProductName || 'Product',
        quantity: Number(ProductQuantity) || 1,
        weight: {
          value: 1,
          unit: 'lb'
        },
        sku: 'default-sku'
      }
    ],
    placed_at: new Date().toISOString(),
    order_number: req.body['payment[orderid]'] || `ORDER-${Date.now()}`,
    weight: {
      value: 1,
      unit: 'lb'
    },
    shipping_method: 'Standard Shipping',
    extra: {},
    metadata: 'Order created from Tilda',
    parcel: {
      length: '34',
      width: '19',
      height: '12',
      distance_unit: 'in',
      weight: '3',
      mass_unit: 'lb'
    }
  };

  try {
    const response = await fetch('https://api.goshippo.com/orders/', {
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
}
