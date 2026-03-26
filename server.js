import express from "express";
import mercadopago from "mercadopago";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// 🔑 COLOQUE SEU ACCESS TOKEN REAL
mercadopago.configure({
  access_token: "APP_USR-1777996193160597-031816-ba8f1e228ae28d5a93265faaa9e95134-348606482"
});

/* ================= PIX ================= */
app.post("/criar-pagamento", async (req, res) => {
  try {
    const { total } = req.body;

    const pagamento = await mercadopago.payment.create({
      transaction_amount: Number(total),
      description: "Compra Pixel Store",
      payment_method_id: "pix",
      payer: {
        email: "teste@teste.com"
      }
    });

    const pix = pagamento.body.point_of_interaction.transaction_data;

    res.json({
      qr_code: pix.qr_code,
      qr_code_base64: pix.qr_code_base64
    });

  } catch (err) {
    console.error("ERRO PIX:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req,res)=>{
  res.send("API ONLINE 🚀");
});

app.listen(3000, () => console.log("Servidor rodando"));
