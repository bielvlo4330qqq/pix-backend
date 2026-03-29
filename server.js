const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");

const { MercadoPagoConfig, Payment } = mercadopago;

const app = express();

app.use(cors());
app.use(express.json());

/* 🔒 TOKEN (use variável de ambiente no Render) */
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN || "APP_USR-1777996193160597-031816-ba8f1e228ae28d5a93265faaa9e95134-348606482"
});

const payment = new Payment(client);

/* ================= STATUS ================= */
app.get("/", (req, res) => {
  res.send("API PIX rodando 🚀");
});

/* ================= PIX ================= */
app.post("/create-pix", async (req, res) => {
  try {
    const { amount } = req.body;

    const response = await payment.create({
      body: {
        transaction_amount: Number(amount),
        description: "Pagamento PixelCoin",
        payment_method_id: "pix",
        payer: {
          email: "teste@teste.com"
        }
      }
    });

    const pix = response.point_of_interaction.transaction_data;

    res.json({
      qr_code: pix.qr_code,
      qr_code_base64: pix.qr_code_base64
    });

  } catch (error) {
    console.error("ERRO PIX:", error);
    res.status(500).json({
      error: "Erro ao gerar PIX",
      detalhe: error.message
    });
  }
});

/* ================= PORTA ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
