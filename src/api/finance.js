import { getJson, postJson } from './http';

export function listInvoices({ limit = 200 } = {}) {
  return getJson(`/invoices?limit=${encodeURIComponent(limit)}`);
}

export function getInvoice(invoiceId) {
  return getJson(`/invoices/${encodeURIComponent(invoiceId)}`);
}

export function createInvoice(payload) {
  return postJson('/invoices', payload);
}

export function sendInvoice(invoiceId) {
  return postJson(`/invoices/${encodeURIComponent(invoiceId)}/send`, {});
}

export function submitInvoiceToFactoring(invoiceId, { provider }) {
  return postJson(`/invoices/${encodeURIComponent(invoiceId)}/submit-factoring`, { provider });
}

export function recordInvoicePayment(invoiceId, payload) {
  return postJson(`/invoices/${encodeURIComponent(invoiceId)}/payments`, payload);
}

export function getFinanceSummary() {
  return getJson('/finance/summary');
}

export function getFinanceForecast({ rangeDays = 30 } = {}) {
  return getJson(`/finance/forecast?range_days=${encodeURIComponent(rangeDays)}`);
}
