    import React from 'react';
    import dotenv from 'dotenv';

    import axios from 'axios';


    const backendUrl = import.meta.env.REACT_APP_BACKEND_URL;
    const razorpayKey =import.meta.env.RAZORPAY_KEY_ID;

    const PaymentDashboard = () => {
        const plans = [
            { name: "CHO-2 Basic", price: 799, features: ["Access to CHO-2.AI", "Basic Support", "100 Queries/Month"] },
            { name: "CHO-2 Pro", price: 1599, features: ["Faster Response Time", "Priority Support", "500 Queries/Month"] },
            { name: "CHO-2 Premium", price: 2399, features: ["Unlimited Queries", "24/7 Support", "API Access"] },
        ];

        const appointmentRazorpay = async (amount) => {
            try {
                const { data } = await axios.post(`http://localhost:5000/user/pay-razorpay`, { amount });
                
                const options = {
                    key: razorpayKey,
                    amount: amount,
                    currency: 'INR',
                    order_id: data.orderId,
                    handler: function (response) {
                        alert("Payment Successful");
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };
                
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
                rzp1.on('payment.failed', function (response) {
                    alert("Payment failed");
                });
            } catch (error) {
                console.log(error);
                alert(error.message);
            }
        };

        return (
            <div className="bg-[#E3E3E3] h-screen w-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-10 text-black">Choose Your CHO-2.AI Plan</h1>

                <div className="flex justify-center items-center w-full px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-4xl">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className="bg-black/30 backdrop-blur-lg border border-white/20 p-8 rounded-xl shadow-lg text-black text-center flex flex-col items-center"
                            >
                                <h2 className="text-2xl font-bold">{plan.name}</h2>
                                <p className="text-xl my-3">₹{plan.price}/month</p>
                                <ul className="text-gray-800 space-y-2 mb-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="text-black">{feature}</li>
                                    ))}
                                </ul>
                                <button onClick={() => appointmentRazorpay(plan.price)} className="mt-auto bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition">
                                    Buy Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    export default PaymentDashboard;
