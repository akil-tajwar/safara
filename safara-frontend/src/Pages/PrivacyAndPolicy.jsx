import { Helmet } from "react-helmet";

const PrivacyAndPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Safara Learning Center</title>
        <meta
          name="description"
          content="Read Safara Learning Center’s privacy policy to understand how we collect, use, and protect your personal information."
        />
      </Helmet>

      <div className="lg:w-3/4 w-11/12 mx-auto py-16">
        <h1 className="text-4xl font-bold text-primary mb-6">
          Privacy Policy
        </h1>

        <p className="text-justify mb-4">
          At <span className="text-primary font-semibold">Safara Learning Center</span>, 
          your privacy is important to us. 
          This Privacy Policy explains how we collect, use, and protect your personal information 
          when you use our platform and services.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          1. Information We Collect
        </h2>
        <p className="text-justify mb-4">
          We collect information that you provide directly, such as your name, email address, 
          payment details, and course activity. We may also collect limited data 
          automatically, including device type, browser information, and IP address.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          2. How We Use Your Information
        </h2>
        <p className="text-justify mb-4">
          Your data is used to provide and improve our services, manage accounts, 
          process payments, communicate updates, and personalize your learning experience. 
          We do not sell or rent your information to third parties.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          3. Data Protection
        </h2>
        <p className="text-justify mb-4">
          We implement strong security measures to protect your information 
          from unauthorized access, alteration, or destruction. 
          However, no online system can guarantee complete security.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          4. Cookies
        </h2>
        <p className="text-justify mb-4">
          Safara Learning Center uses cookies to enhance user experience 
          and analyze website performance. 
          You may choose to disable cookies in your browser settings, 
          but this may affect some platform functionality.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          5. Third-Party Services
        </h2>
        <p className="text-justify mb-4">
          We may use trusted third-party tools for analytics, payments, and authentication 
          (such as Google Sign-In). These services operate under their own privacy policies.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          6. Your Rights
        </h2>
        <p className="text-justify mb-4">
          You have the right to access, modify, or delete your personal information. 
          You can contact us to request data correction or removal from our system.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-8 mb-3">
          7. Updates to This Policy
        </h2>
        <p className="text-justify mb-4">
          We may revise this Privacy Policy periodically. 
          Updates will be reflected with a new “Last Updated” date below.
        </p>

        <p className="mt-10 text-gray-600 italic">
          Last updated: November 2025
        </p>
      </div>
    </>
  );
};

export default PrivacyAndPolicy;
