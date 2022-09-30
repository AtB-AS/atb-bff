/*
Ticket information to use in other scenarios
 */

let AClass = null

export const ticketData = {
    creatTicket: (orderId, paymentId, transactionId, netsTransactionId) => AClass = new Ticket(orderId, paymentId, transactionId, netsTransactionId),
    orderId: () => AClass.getOrderId(),
    paymentId: () => AClass.getPaymentId(),
    transactionId: () => AClass.getTransactionId(),
    netsTransactionId: () => AClass.getNetsTransactionId()
}

class Ticket {
    constructor(orderId, paymentId, transactionId, netsTransactionId) {
        this.orderId = orderId
        this.paymentId = paymentId
        this.transactionId = transactionId
        this.netTransactionId = netsTransactionId
    }
    getOrderId(){
        return this.orderId
    }
    getPaymentId(){
        return this.paymentId
    }
    getTransactionId(){
        return this.transactionId
    }
    getNetsTransactionId(){
        return this.netTransactionId
    }
}