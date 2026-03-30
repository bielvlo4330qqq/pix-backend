import express from "express";
import mercadopago from "mercadopago";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 SEU TOKEN
mercadopago.configurations.setAccessToken("APP_USR-1777996193160597-031816-ba8f1e228ae28d5a93265faaa9e95134-348606482");

// 🔥 ROTA PIX
app.post("/create-pix", async (req, res) => {

try {

console.log("BODY:", req.body);

const amount = Number(req.body.amount);

if (!amount || amount <= 0) {
return res.status(400).json({ error: "Valor inválido" });
}

// 🔥 CRIA PAGAMENTO PIX
const payment = await mercadopago.payment.create({
transaction_amount: amount,
payment_method_id: "pix",
description: "Pagamento Pixel Store",
payer: {
email: "cliente@email.com"
}
});

// 🔥 PEGA O QR CODE CORRETO
const pix = payment.body.point_of_interaction.transaction_data;

// 🔥 RETORNA LIMPO PRO FRONT
return res.json({
qr_code: pix.qr_code,
qr_code_base64: pix.qr_code_base64
});

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

// 🔥 PORTA (RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Servidor rodando na porta " + PORT);
});
