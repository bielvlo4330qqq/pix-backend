const express = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mercadopago.configure({
  access_token: "SEU_TOKEN_AQUI"
});

/* ================= PIX ================= */
app.post("/criar-pagamento", async (req, res) => {
  try {
    const { total } = req.body;

    const pagamento = await mercadopago.payment.create({
      transaction_amount: parseFloat(total),
      description: "Compra Pixel Store",
      payment_method_id: "pix",
      payer: {
        email: "teste@teste.com"
      }
    });

    console.log("RESPOSTA MP:", pagamento.body);

    const dadosPix = pagamento.body?.point_of_interaction?.transaction_data;

    if (!dadosPix) {
      return res.status(500).json({
        error: "PIX não retornado",
        detalhe: pagamento.body
      });
    }

    res.json({
      qr_code: dadosPix.qr_code,
      qr_code_base64: dadosPix.qr_code_base64
    });

  } catch (err) {
    console.error("ERRO PIX:", err);
    res.status(500).json({
      error: "Erro ao gerar PIX",
      detalhe: err.message
    });
  }
});

/* ================= STATUS ================= */
app.get("/", (req,res)=>{
  res.send("API ONLINE 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando"));
