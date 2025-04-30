export const statusMap = {
    pending: {
        label: "Aguardando confirmação da loja",
        description: "Aguardando confirmação do restaurante.",
        image: "waiting_confirm.svg",
    },
    ongoing: {
        label: "Em preparo",
        description: "O restaurante está preparando seu pedido.",
        image: "preparing.svg",
    },
    accepted: {
        label: "Em preparo",
        description: "O restaurante está preparando seu pedido.",
        image: "preparing.svg",
    },
    ready: {
        label: "Pronto para retirada",
        description: "Seu pedido já está pronto e pode ser retirado!",
        image: "ready_to_withdrawal.svg",
    },
    delivered: {
        label: "Saiu para entrega",
        description: "Seu pedido está a caminho, fique de olho!",
        image: "in_delivery.svg",
    },
    finished: {
        label: "Pedido finalizado",
        description: "Pedido entregue/finalizado.",
        image: "pedido-finalizado.svg",
    },
    canceled: {
        label: "Pedido cancelado",
        description: "Seu pedido foi cancelado.",
        image: "canceled.svg",
    },
    canceled_waiting_payment: {
        label: "Pedido cancelado",
        description: "Seu pedido foi cancelado por falta de pagamento.",
        image: "canceled.svg",
    },
    default: {
        label: "Status desconhecido",
        description: "Entre em contato com o suporte.",
        image: "desconhecido.svg",
    },
}; 