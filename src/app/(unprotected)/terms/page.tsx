
'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Last updated: January 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  By accessing or using Cozy, you agree to be bound by these Terms of Service and our Privacy Policy. 
                  If you don't agree to these terms, please don't use our platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. Description of Service
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  Cozy is a community platform that enables users to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create and join communities</li>
                  <li>Share posts, comments, and messages</li>
                  <li>Use templates and customize community spaces</li>
                  <li>Install bots and plugins (when available)</li>
                  <li>Interact with other users through various features</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. User Accounts
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  To use Cozy, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Providing accurate and complete information</li>
                  <li>Maintaining the security of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us of any unauthorized use</li>
                </ul>
                <p>
                  You must be at least 13 years old to create an account.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Acceptable Use
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  You agree not to use Cozy to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Harass, bully, or harm others</li>
                  <li>Share illegal, harmful, or inappropriate content</li>
                  <li>Spam or send unsolicited messages</li>
                  <li>Impersonate others or create fake accounts</li>
                  <li>Violate intellectual property rights</li>
                  <li>Attempt to hack or compromise the platform</li>
                  <li>Use the platform for commercial purposes without permission</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Content and Intellectual Property
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  You retain ownership of content you create on Cozy. By posting content, you grant us a license to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Display and distribute your content on the platform</li>
                  <li>Make your content available to other users as intended</li>
                  <li>Moderate content to ensure platform safety</li>
                </ul>
                <p>
                  We respect intellectual property rights and will respond to valid copyright notices.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Community Guidelines
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  Communities on Cozy should be welcoming and safe spaces. We expect users to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Treat others with respect and kindness</li>
                  <li>Follow community-specific rules</li>
                  <li>Report inappropriate behavior</li>
                  <li>Contribute positively to discussions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Developer Terms
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  If you create templates, bots, or plugins for Cozy:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must follow our developer guidelines</li>
                  <li>Your code will be reviewed for security and safety</li>
                  <li>We may remove content that violates our policies</li>
                  <li>Revenue sharing terms apply to paid marketplace items</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Privacy and Data
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                  use, and protect your information.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Termination
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  We may suspend or terminate your account if you violate these terms. You may delete your account 
                  at any time through your account settings.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. Disclaimers and Limitations
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  Cozy is provided "as is" without warranties. We are not liable for user-generated content or 
                  third-party integrations. Our liability is limited to the maximum extent permitted by law.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                11. Changes to Terms
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  We may update these terms from time to time. We'll notify you of significant changes. 
                  Continued use of Cozy after changes means you accept the new terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                12. Contact Information
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  If you have questions about these terms, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: legal@cozy.com</li>
                  <li>Support: help.cozy.com</li>
                  <li>Discord: discord.gg/cozydev</li>
                </ul>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
