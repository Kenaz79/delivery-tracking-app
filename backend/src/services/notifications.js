// Push notification service. Stubbed for the prototype — logs instead of sending.
// Swap in Firebase Admin SDK's messaging().send() once FCM_SERVER_KEY is configured.

async function notifyCustomer(customerId, { title, body }) {
  // TODO: look up the customer's FCM device token and send via Firebase Admin SDK
  console.log(`[notify:customer:${customerId}] ${title} — ${body}`);
}

async function notifyRider(riderId, { title, body }) {
  console.log(`[notify:rider:${riderId}] ${title} — ${body}`);
}

async function notifyManager({ title, body }) {
  console.log(`[notify:manager] ${title} — ${body}`);
}

module.exports = { notifyCustomer, notifyRider, notifyManager };
