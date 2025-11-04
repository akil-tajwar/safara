import { Helmet } from "react-helmet";
import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Safara Learning Center?",
      answer:
        "Safara Learning Center is an online learning platform that offers high-quality courses across different fields. It provides video lessons, quizzes, and certificates upon completion to help learners enhance their skills effectively.",
    },
    {
      question: "How do I create an account?",
      answer:
        "You can create an account by clicking on the 'Sign Up' button on the homepage. We support both Google authentication and the traditional email-password registration method.",
    },
    {
      question: "How can I enroll in a course?",
      answer:
        "To enroll, simply choose a course and complete the payment process. Once the payment is confirmed, the course content will be unlocked in your dashboard.",
    },
    {
      question: "Can I access course materials after completion?",
      answer:
        "Yes! You will have lifetime access to your purchased courses, including all lessons, quizzes, and updates, unless the course is removed by the admin or instructor.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "Currently, all course purchases are non-refundable unless otherwise specified by Safara Learning Center. Please review the course details carefully before purchasing.",
    },
    {
      question: "How does the quiz system work?",
      answer:
        "Each course includes a quiz section created by the instructor. You must complete all videos before attempting the quiz. After submission, you’ll see your marks and correct answers instantly.",
    },
    {
      question: "How do I get my course completion certificate?",
      answer:
        "Once you complete all course videos and successfully finish the quiz, your certificate will be automatically unlocked and available for download from your profile menu.",
    },
    {
      question: "Can I become a teacher on Safara Learning Center?",
      answer:
        "Yes. If you’re passionate about teaching, you can contact the admin to apply as an instructor. Once approved, you’ll be able to upload courses, videos, and create quizzes for learners.",
    },
    {
      question: "How do I rate or review a course?",
      answer:
        "After completing a course, you can leave a rating and write a review. Your feedback helps others decide which courses to take and helps instructors improve their content.",
    },
    {
      question: "Is my personal data safe?",
      answer:
        "Absolutely. We follow strict data protection practices. Your personal details and payment information are encrypted and handled securely as described in our Privacy Policy.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>FAQ | Safara Learning Center</title>
        <meta
          name="description"
          content="Frequently Asked Questions about Safara Learning Center — learn about account creation, payments, certificates, and more."
        />
      </Helmet>

      <div className="lg:w-3/4 w-11/12 mx-auto py-16">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-center mb-10 text-gray-600">
          Have questions about Safara Learning Center? Here are some of the most
          common ones we’ve answered for you.
        </p>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-5 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
              >
                <span className="font-semibold text-secondary">
                  {faq.question}
                </span>
                <span className="text-primary text-xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="p-5 bg-white border-t border-gray-200 text-justify">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-gray-600 italic">
          Still have questions? Contact our support team for help.
        </p>
      </div>
    </>
  );
};

export default FAQ;
