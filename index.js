export default async function handler(req, res) {
  const data = req.body;

  console.log("Received webhook data from Tilda:", data);

  res.status(200).json({ message: "Webhook received successfully" });
}
