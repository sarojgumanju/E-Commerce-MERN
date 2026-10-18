import axios from "axios";
import config from "../config/config.js";

const payViaKhalti = async (data) => {
  const body = {
    return_url: config.khalti.returnUrl,
    website_url: config.khalti.websiteUrl,
    amount: data.amount * 100,
    purchase_order_id: data.purchaseOrderId,
    purchase_order_name: data.purchaseOrderName,
    customer_info: data.customerInfo,
  };

  try {
    const response = await axios.post(config.khalti.apiUrl, body, {
      headers: {
        Authorization: `Key ${config.khalti.secretKey}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Khalti error:", error.response?.data);
      console.error("Khalti error body:", JSON.stringify(error.response?.data, null, 2));

    throw error;
  }
};

export default payViaKhalti;
