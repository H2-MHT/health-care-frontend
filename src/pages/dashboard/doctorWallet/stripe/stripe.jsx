import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


import CheckoutForm from "./checkoutForm";

import "./Stripe.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51Qc28V02L1uPEHqcAqu3jU4bvgNfeyYIOvlx5UAQ22sWc6YofBo2zZUuoGZalN5OkcqDafuKOLjijElibOV0CvyI006XVcNFN3");

export default function App() {
  const [clientSecret, setClientSecret] = useState("");
 

  useEffect(() => {
    const payload = {
      // test_token: "pm_card_visa",
      // amount: "500", // Amount in cents
      // description: "Test Payment",
      // appointment_id: 21,
      test_token: "pm_card_visa",
      amount: "5",
      description: "Test Payment",
      payment_method_types: ["card"],
      appointment_id: 21
    };

    // Create PaymentIntent as soon as the page loads
    fetch("http://209.38.123.166/payment/",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = 'auto';
console.log(clientSecret,">>>>>>>>>>>>>clientSecret")
  return (
 
      <div className="App">
        {clientSecret && (
          <Elements options={{clientSecret, appearance, loader}} stripe={stripePromise}>
          
            <CheckoutForm />
              
         
          </Elements>
        )}
      </div>
   
  );
}










// import React, { useState, useEffect } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "./checkoutForm";
// import CompletePage from "./completePage";
// import { useNavigate } from "react-router-dom";
// import { postRequest } from "../../../../hooks/services/services";
// import "./Stripe.css";

// // Load Stripe once outside component rendering
// const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");

// function Stripe() {
//   const [clientSecret, setClientSecret] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPaymentIntent = async () => {
//       try {
//         const payload = {
//           test_token: "pm_card_visa",
//           amount: "500",
//           description: "Test Payment",
//           appointment_id: 21,
//         };

//         const response = await postRequest("payment/", payload);

//         if (response.status === 200) {
//           const responseData = await response.json();
//           if (responseData?.clientSecret) {
//             setClientSecret(responseData.clientSecret);
//             console.log("PaymentIntent created:", responseData.clientSecret);
//           } else {
//             console.error("Client secret not returned in response:", responseData);
//           }
//         } else {
//           console.error("Payment failed with status:", response.status);
//         }
//       } catch (error) {
//         console.error("Error fetching clientSecret:", error.message);
//       }
//     };

//     fetchPaymentIntent();
//   }, []);

//   const appearance = { theme: "stripe" };
//   const loader = "auto";

//   return (
//     <div className="App">
//       {clientSecret ? (
//         <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
//           <CheckoutForm />
//         </Elements>
//       ) : (
//         <p>Loading payment details...</p>
//       )}
//     </div>
//   );
// }

// export default Stripe;



