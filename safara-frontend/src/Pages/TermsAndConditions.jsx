import { Helmet } from "react-helmet";

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Safara Learning Center</title>
        <meta
          name="description"
          content="Read the terms and conditions of Safara Learning Center. Learn how you can use our platform responsibly."
        />
      </Helmet>

      <div className="lg:w-3/4 w-11/12 mx-auto py-16">
        <h1 className="text-4xl font-bold text-primary mb-6">
          Terms & Conditions
        </h1>
        <p className="text-justify mb-4">
          Welcome to <span className="text-primary font-semibold">Safara Learning Center</span>. 
          By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. 
          Please read them carefully before using our services.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          1. Account Creation
        </h2>
        <p className="text-justify mb-4">
          Users must provide accurate and complete information during registration. 
          You are responsible for maintaining the confidentiality of your account credentials 
          and all activities that occur under your account.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          2. Course Enrollment
        </h2>
        <p className="text-justify mb-4">
          Once you enroll in a course by paying the required fee, you are granted 
          access to its contents for personal educational use only. 
          Sharing, redistributing, or reselling course materials is strictly prohibited.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          3. Instructor Responsibilities
        </h2>
        <p className="text-justify mb-4">
          Instructors must ensure that all uploaded course materials, 
          including videos, documents, and quizzes, comply with our content standards 
          and do not infringe upon third-party rights.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          4. Payments and Refunds
        </h2>
        <p className="text-justify mb-4">
          All payments made for courses are non-refundable unless otherwise specified. 
          Safara Learning Center reserves the right to modify pricing or refund policies 
          at any time with prior notice.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          5. User Conduct
        </h2>
        <p className="text-justify mb-4">
          Users agree not to misuse the platform, post offensive content, 
          or engage in any activity that disrupts the learning environment. 
          Violation of these rules may result in account suspension or termination.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          6. Intellectual Property
        </h2>
        <p className="text-justify mb-4">
          All materials provided through Safara Learning Center, 
          including text, videos, logos, and graphics, 
          are owned by the platform or respective instructors 
          and protected by copyright laws.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          7. Modifications
        </h2>
        <p className="text-justify mb-4">
          Safara Learning Center reserves the right to update or modify these Terms 
          at any time. Continued use of the platform after such changes 
          constitutes your acceptance of the new Terms.
        </p>

        <p className="mt-10 text-gray-600 italic">
          Last updated: November 2025
        </p>
      </div>
    </>
  );
};

export default TermsAndConditions;
