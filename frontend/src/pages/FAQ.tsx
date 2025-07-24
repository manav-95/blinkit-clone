import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqData = [
  {
    question: 'What is Shopit?',
    answer: 'Shopit is an instant delivery service that brings groceries and essentials to your doorstep in minutes.',
  },
  {
    question: 'How fast can I get my order?',
    answer: 'Most Shopit orders are delivered within 10-20 minutes, depending on your location.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'You can pay using UPI, debit/credit cards, net banking, or cash on delivery (if available).',
  },
  {
    question: 'Is there a delivery charge?',
    answer: 'Delivery charges may apply based on your order value and location. Offers may waive these charges at times.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-6 font-poppins">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-medium focus:outline-none"
            >
              <span>{faq.question}</span>
              {openIndex === index ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 py-3 text-gray-600 text-sm bg-gray-50">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
