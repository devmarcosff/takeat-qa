export const statusMap = {
    // Novos pedidos
    pending: {
        label: "Aguardando confirmação da loja",
        description: "Aguardando confirmação do restaurante.",
        image: "waiting_confirm.svg",
    },
    // Cozinha
    accepted: {
        label: "Em preparo",
        description: "O restaurante está preparando seu pedido.",
        image: "preparing.svg",
    },
    // Em rota
    ongoing: {
        label: "Em rota",
        description: "Seu pedido já saiu para entrega, fique de olho.",
        image: "preparing.svg",
    },
    // Pronto para retirada
    ready: {
        label: "Pronto para retirada",
        description: "Seu pedido já está pronto e pode ser retirado.",
        image: "ready_to_withdrawal.svg",
    },
    // Entregue
    delivered: {
        label: "Pedido entregue",
        description: "Seu pedido foi entregue com sucesso.",
        image: "in_delivery.svg",
    },
    // Finalizado
    finished: {
        label: "Pedido finalizado",
        description: "Seu pedido foi finalizado com sucesso.",
        image: "pedido-finalizado.svg",
    },
    // Cancelado
    canceled: {
        label: "Pedido cancelado",
        description: "Seu pedido foi cancelado.",
        image: "canceled.svg",
    },
    // Cancelado por falta de pagamento
    canceled_waiting_payment: {
        label: "Pedido cancelado",
        description: "Seu pedido foi cancelado por falta de pagamento.",
        image: "canceled.svg",
    },
    // Status desconhecido
    default: {
        label: "Status desconhecido",
        description: "Entre em contato com o suporte.",
        image: "desconhecido.svg",
    },
};