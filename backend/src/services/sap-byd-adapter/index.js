// SAP Business ByDesign integration adapter.
// Keep all ByD-specific logic isolated here so the rest of the backend
// never has to know about OData/SOAP or ByD's field names.

const USE_MOCK = !process.env.SAP_BYD_BASE_URL;

/**
 * Push a delivery note to SAP ByD once a delivery is created/accepted.
 * @param {object} delivery - internal delivery object
 * @returns {Promise<string>} the created ByD delivery-note reference id
 */
async function pushDeliveryNote(delivery) {
  if (USE_MOCK) {
    // No SAP_BYD_BASE_URL configured — return a fake reference so the rest of the
    // app (and the demo) works end to end without live SAP credentials.
    console.log(`[sap-byd:mock] would push delivery note for delivery ${delivery.id}`);
    return `MOCK-DN-${delivery.id.slice(0, 8)}`;
  }

  // TODO: authenticate via OAuth2, call the real ByD OData endpoint
  // const mapped = mapToByDDeliveryNote(delivery);
  // const res = await client.post('/DeliveryNoteCollection', mapped);
  // return res.data.DeliveryNoteID;
  throw new Error('Live SAP ByD client not implemented yet — unset SAP_BYD_BASE_URL to use the mock');
}

/**
 * Fetch destination details for a given order from SAP ByD.
 * @param {string} orderId
 */
async function fetchDestination(orderId) {
  if (USE_MOCK) {
    console.log(`[sap-byd:mock] would fetch destination for order ${orderId}`);
    return { address: 'Mock destination, Kampala', lat: 0.3476, lng: 32.5825 };
  }

  // TODO: call the real ByD OData endpoint, map response to internal shape
  throw new Error('Live SAP ByD client not implemented yet — unset SAP_BYD_BASE_URL to use the mock');
}

module.exports = { pushDeliveryNote, fetchDestination };
