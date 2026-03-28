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

    console.log("RESPOSTA MP:", pagamento.body);

    // 🔥 valida se veio PIX
    const dadosPix = pagamento.body?.point_of_interaction?.transaction_data;

    if (!dadosPix) {
      return res.status(500).json({
        error: "PIX não retornado pelo Mercado Pago",
        detalhe: pagamento.body
      });
    }

    // ✅ retorno seguro
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
