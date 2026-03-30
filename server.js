import express from "express";
import mercadopago from "mercadopago";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 COLOQUE SEU ACCESS TOKEN
mercadopago.configurations.setAccessToken("SEU_ACCESS_TOKEN_AQUI");

// 🔥 ROTA PIX
app.post("/create-pix", async (req, res) => {

try {

console.log("BODY:", req.body);

const amount = Number(req.body.amount);

if (!amount || amount <= 0) {
return res.status(400).json({ error: "Valor inválido" });
}

const payment = await mercadopago.payment.create({
transaction_amount: amount,
payment_method_id: "pix",
payer: {
email: "cliente@email.com"
}
});

return res.json(payment);

} catch (err) {

console.error("ERRO BACKEND:", err);

return res.status(500).json({
error: err.message
});
}
});

// 🔥 ROTA TESTE
app.get("/", (req,res)=>{
res.send("API PIX ONLINE 🚀");
});

app.listen(3000, () => console.log("Servidor rodando"));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
