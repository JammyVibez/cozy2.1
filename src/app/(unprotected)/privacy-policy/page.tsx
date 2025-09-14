
'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
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
                1. Information We Collect
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  At Cozy, we collect information to provide and improve our community platform. The information we collect includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (email, username, profile details)</li>
                  <li>Content you create (posts, comments, messages)</li>
                  <li>Usage data (interactions, preferences, device information)</li>
                  <li>Community data (memberships, roles, activity)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. How We Use Your Information
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain our platform services</li>
                  <li>Personalize your experience and content recommendations</li>
                  <li>Facilitate community interactions and communications</li>
                  <li>Ensure platform safety and prevent abuse</li>
                  <li>Send important updates and notifications</li>
                  <li>Improve our services through analytics</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. Information Sharing
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  We don't sell your personal information. We may share information in limited circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With your consent or at your direction</li>
                  <li>With service providers who help operate our platform</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect rights, safety, and security</li>
                  <li>In connection with business transfers (with notice)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Your Rights and Choices
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and download your data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Control privacy settings</li>
                  <li>Opt out of certain communications</li>
                  <li>Export your content</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Data Security
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  We implement appropriate technical and organizational measures to protect your information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Access controls and authentication</li>
                  <li>Regular security assessments</li>
                  <li>Incident response procedures</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. International Data Transfers
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  Cozy operates globally. Your information may be transferred to and processed in countries other than your own, 
                  including the United States. We ensure appropriate safeguards are in place for such transfers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Children's Privacy
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  Cozy is not intended for children under 13. We don't knowingly collect information from children under 13. 
                  If we become aware that we have collected such information, we will delete it promptly.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Changes to This Policy
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  We may update this privacy policy from time to time. We will notify you of significant changes through 
                  the platform or by email. Your continued use of Cozy after changes become effective constitutes acceptance.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Contact Us
              </h2>
              <div className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  If you have questions about this privacy policy or our data practices, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: privacy@cozy.com</li>
                  <li>Support Portal: help.cozy.com</li>
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
