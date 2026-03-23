const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 COLOQUE SEU TOKEN AQUI
mercadopago.configure({
  access_token: "SEU_ACCESS_TOKEN_AQUI"
});

app.get("/", (req, res) => {
  res.send("API PIX rodando 🚀");
});

app.post("/create-pix", async (req, res) => {
  try {
    const { amount } = req.body;

    const payment = await mercadopago.payment.create({
      transaction_amount: Number(amount),
      description: "Pagamento PixelCoin",
      payment_method_id: "pix",
      payer: {
        email: "teste@teste.com"
      }
    });

    res.json({
      qr_code: payment.body.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: payment.body.point_of_interaction.transaction_data.qr_code_base64
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar PIX" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
