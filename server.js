import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const { MercadoPagoConfig, Payment } = mercadopago;

const app = express();
app.use(express.json());
app.use(cors());

/* ================= CONFIG ================= */
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN
});

const payment = new Payment(client);

/* ================= PIX ================= */
app.post("/criar-pagamento", async (req, res) => {
  try {
    const { total } = req.body;

    const response = await payment.create({
      body: {
        transaction_amount: Number(total),
        description: "Compra Pixel Store",
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

  } catch (err) {
    console.error("❌ ERRO PIX:", err);
    res.status(500).json({
      error: err.message
    });
  }
});

/* ================= CARTÃO ================= */
app.post("/pagar-cartao", async (req, res) => {
  try {
    const { token, total, parcelas, email, bandeira } = req.body;

    const response = await payment.create({
      body: {
        transaction_amount: Number(total),
        token: token,
        description: "Compra Pixel Store",
        installments: Number(parcelas),
        payment_method_id: bandeira || "visa",
        payer: {
          email: email
        }
      }
    });

    res.json({
      status: response.status,
      status_detail: response.status_detail
    });

  } catch (err) {
    console.error("❌ ERRO CARTÃO:", err);
    res.status(500).json({
      error: err.message
    });
  }
});

/* ================= STATUS ================= */
app.get("/", (req, res) => {
  res.send("API ONLINE 🚀");
});

/* ================= PORTA ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
