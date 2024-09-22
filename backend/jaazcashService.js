import axios from "axios";
import crypto from "crypto";
import { formatDateYmdHis, removeDecimal } from "./utils.js";

//JAAZ_CASH_MOBILE_API_URL = "https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction";

export default class JaazCashApi {
  constructor() {
    this.merchantId = process.env.MARCHANT_ID;
    this.password = process.env.PASSWORD;
    this.integritySalt = process.env.INTEGRITY_SALT;
    this.returnUrl = "http://localhost/orderhistory";
  }

  async processPayment(payload) {
    const data = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: process.env.MERCHANT_ID,
      pp_SubMerchantID: "",
      pp_BankID: "",
      pp_ProductID: payload.refId,
      pp_Password: process.env.PASSWORD,
      pp_TxnRefNo: `T${formatDateYmdHis(new Date())}`,
      pp_Amount: removeDecimal(payload.amount),
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: formatDateYmdHis(new Date()),
      pp_BillReference: "billRef",
      pp_Description: "Description",
      pp_TxnExpiryDateTime: formatDateYmdHis(
        new Date(Date.now() + 60 * 60 * 1000)
      ),
      pp_ReturnURL: "http://localhost/orderhistory",
      pp_SecureHash: "",
      ppmpf_1: payload.phoneNumber,
      ppmpf_2: "",
      ppmpf_3: "",
      ppmpf_4: "",
      ppmpf_5: "",
    };

    const concatstring = Object.keys(data)
      .sort()
      .map((key) => data[key])
      .filter((value) => (value ? true : false))
      .join("&");

    const hmacSha256 = crypto.createHmac(
      "sha256",
      Buffer.from(process.env.INTEGRITY_SALT, "utf-8")
    );

    const sha256Result = hmacSha256
      .update(
        Buffer.from(`${process.env.INTEGRITY_SALT}&${concatstring}`, "utf-8")
      )
      .digest("hex");

    data.pp_SecureHash = sha256Result;

    try {
      const response = await axios.post(
        process.env.JAAZ_CASH_MOBILE_API_URL,
        new URLSearchParams(data)
      );

      console.log(response.data);

      if (response.data.pp_ResponseCode === "124") {
        return true;
      }

      throw new Error(response.data.pp_ResponseMessage);
    } catch (error) {
      console.error("Payment processor error: ", error.message);
      return false;
    }
  }
}
