import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/landing/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="App">
        <br />
        <div className="work-section-top">
          <p className="primary-subheading">MailWALKER Terms and Conditions</p>
          <h1 className="primary-heading">Terms and Conditions</h1>
          <p className="primary-text">
            By using our services, you agree to comply with the following terms
            and conditions. Please read them carefully. If you do not agree with
            any part of these terms, you may not use our services.
          </p>
        </div>
        <br />
        <br />
        <br/>
        <div className="work-section-top">
          <p className="primary-subheading">1. Information Collection</p>
          <h1 className="primary-heading">
            Collection of data
          </h1>
          <p className="primary-text">
            We collect certain information from users as outlined in our Privacy
            Policy. This includes, but is not limited to, your name, date of
            birth, email address, password, answer to a secret question, and
            phone number. This information is collected for the purpose of
            providing and improving our services.
          </p>
        </div>

        <div className="work-section-top">
          <p className="primary-subheading">2. User Conduct</p>
          <h1 className="primary-heading">Code of Conduct</h1>
          <p className="primary-text">
            <ul>
              <li>
                Users must agree to use our services responsibly and in
                compliance with applicable laws.
              </li>
              <li>
                Engaging in any form of malicious activity or attempting to
                compromise the security of our platform is strictly prohibited.
              </li>
              <li>
                We reserve the right to suspend or terminate accounts that
                violate our code of conduct.
              </li>
            </ul>
          </p>
        </div>
        <div className="work-section-top">
          <p className="primary-subheading">3. Intellectual Property</p>
          <h1 className="primary-heading">Ownership of Content</h1>
          <p className="primary-text">
            <ul>
              <li>
                All content provided by our services is the intellectual
                property of MailWALKER.
              </li>
              <li>
                Users are granted a non-exclusive, non-transferable license to
                use the content for personal purposes.
              </li>
              <li>
                Unauthorized use, reproduction, or distribution of our content
                is prohibited.
              </li>
            </ul>
          </p>
        </div>
        <div className="work-section-top">
          <p className="primary-subheading">4. Termination of Services</p>
          <h1 className="primary-heading">Termination</h1>
          <p className="primary-text">
            <ul>
              <li>
                We reserve the right to terminate or suspend your access to our
                services at our discretion, without prior notice, for any
                reason, including a breach of these terms.
              </li>
              <li>
                Upon termination, you must cease using our services, and any
                remaining obligations or liabilities will continue to apply.
              </li>
            </ul>
          </p>
        </div>
        <div className="work-section-top">
          <p className="primary-subheading">5. Disclaimer of Warranties</p>
          <h1 className="primary-heading">No Warranty</h1>
          <p className="primary-text">
            <ul>
              <li>
                Our services are provided "as is" without any warranty, either
                expressed or implied, including but not limited to the implied
                warranties of merchantability, fitness for a particular purpose,
                or non-infringement.
              </li>
              <li>
                We do not warrant that our services will be error-free or
                uninterrupted, or that defects will be corrected.
              </li>
            </ul>
          </p>
        </div>
        <div className="work-section-top">
          <p className="primary-subheading">6. Limitation of Liability</p>
          <h1 className="primary-heading">Limitation of Liability</h1>
          <p className="primary-text">
            <ul>
              <li>
                We shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or
                revenues, whether incurred directly or indirectly, or any loss
                of data, use, goodwill, or other intangible losses resulting
                from your use of our services.
              </li>
              <li>
                In no event shall our total liability for all claims related to
                our services exceed the total amount paid by you, if any, for
                accessing our services during the twelve months preceding the
                claim.
              </li>
            </ul>
          </p>
        </div>
        <div className="work-section-top">
          <p className="primary-subheading">
            7. Changes to Terms and Conditions
          </p>
          <h1 className="primary-heading">Modifications</h1>
          <p className="primary-text">
            We reserve the right to modify these Terms and Conditions at any
            time. Users will be notified of changes, and continued use of our
            services constitutes acceptance of the modified terms.
          </p>
        </div>
        <div className="work-section-top">
          <p className="primary-subheading">8. Contact Information</p>
          <h1 className="primary-heading">Contact Us</h1>
          <p className="primary-text">
            For any questions or concerns regarding these Terms and Conditions
            or our Privacy Policy, please contact us at
            mailwalker.contact@gmail.com.
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TermsAndConditions;
