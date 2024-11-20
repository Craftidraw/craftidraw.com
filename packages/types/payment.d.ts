export interface SubscriptionShell {
    id: string;
    status: string;
    payment_method_id: string;
    current_period_end: number;
    cancel_at_period_end: boolean;
}

export interface PaymentMethodShell {
    customer: string;
    id: string;
    allow_redisplay: string;
    card: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
}

export interface InvoiceShell {
    status: string;
    created: number;
    lines: {
        data: Array<{
            description: string;
            amount: number;
        }>;
    };
    download_url: string;
    hosted_invoice_url: string;
}
