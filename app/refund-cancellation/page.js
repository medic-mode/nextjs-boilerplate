import './refund.css'

const page = () => {
  return (
    <div className="refund-cancellation">
      <h1>
        <span style={{ color: 'var(--orange)' }}>Refund and Cancellation Policy</span>
      </h1>
      <p>
        At Medicmode, we strive to ensure a seamless experience for our users. Please read our refund and cancellation policy carefully before making any purchase.
      </p>

      <h2>Cancellation Policy</h2>

      <h3>Online Courses and Workshops:</h3>
      <ul>
        <li>Cancellations must be requested at least 48 hours before the scheduled start of the course or workshop.</li>
        <li>
          If the request is approved, a cancellation confirmation email will be sent, and any eligible refund will be processed.
        </li>
      </ul>

      <h3>Offline Courses and Training Programs:</h3>
      <ul>
        <li>For cancellations of offline programs, you must notify us at least 7 days prior to the event date.</li>
        <li>No cancellations or refunds will be allowed for requests made within 7 days of the program.</li>
      </ul>

      <h3>Customized Training Programs:</h3>
      <ul>
        <li>Cancellations for corporate or institutional training programs must be made at least 15 days in advance.</li>
        <li>
          Any non-refundable expenses (e.g., venue booking, materials) will be deducted from the refundable amount.
        </li>
      </ul>

      <h2>Refund Policy</h2>

      <h3>Eligibility for Refunds:</h3>
      <ul>
        <li>Refunds are applicable only if cancellation requests are submitted within the specified timeframes mentioned above.</li>
        <li>Refunds will not be provided for no-shows or cancellations made outside the stated window.</li>
      </ul>

      <h3>Processing Refunds:</h3>
      <ul>
        <li>Refunds will be processed within 7-10 business days from the approval of the cancellation request.</li>
        <li>The refund will be credited to the original payment method used at the time of purchase.</li>
      </ul>

      <h3>Non-Refundable Items:</h3>
      <ul>
        <li>Fees paid for courses or training programs already attended are non-refundable.</li>
        <li>Administrative fees or charges for digital materials and certificates are also non-refundable.</li>
      </ul>

      <h3>Partial Refunds:</h3>
      <ul>
        <li>
          If you withdraw from an ongoing course, any refund amount will be determined on a pro-rata basis at the discretion of Medicmode.
        </li>
      </ul>

      <h2>How to Request a Refund or Cancellation</h2>
      <p>
        Send an email to <a href="mailto:contact@medicmode.com">contact@medicmode.com</a> with the following details:
      </p>
      <ul>
        <li>Name</li>
        <li>Contact information</li>
        <li>Payment details</li>
        <li>Reason for cancellation/refund request</li>
        <li>Relevant booking or transaction ID</li>
      </ul>
      <p>Our team will review your request and respond within 2-3 business days.</p>

      <p>
        <strong>Note:</strong> Medicmode reserves the right to modify this policy at any time without prior notice. All updates will be reflected on this page.
      </p>
    </div>
  );
};

export default page;
