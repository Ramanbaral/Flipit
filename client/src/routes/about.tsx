import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'What is ReCommerce Platform?',
    answer:
      'ReCommerce Platform is a revolutionary e-commerce solution designed to make buying and selling recommerced products simple, secure, and sustainable. We bridge the gap between quality pre-owned goods and conscious consumers.',
  },
  {
    id: 2,
    question: 'How do I sell items on ReCommerce?',
    answer:
      'Simply create an account, list your items with photos and descriptions, set your price, and we handle the rest. Our team verifies items for quality, and you earn money when your item sells.',
  },
  {
    id: 3,
    question: 'Are the products authentic?',
    answer:
      'Yes! Every item goes through our quality verification process. We inspect products for authenticity, condition, and functionality before listing them for sale.',
  },
  {
    id: 4,
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, debit cards, digital wallets (PayPal, Apple Pay, Google Pay), and bank transfers for your convenience.',
  },
  {
    id: 5,
    question: 'How long does shipping take?',
    answer:
      'Standard shipping takes 5-7 business days. We also offer expedited shipping (2-3 days) for urgent orders. All packages are insured and tracked.',
  },
  {
    id: 6,
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy on all items. If you receive a damaged or misrepresented product, contact us immediately for a full refund or replacement.',
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-purple-200 transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-50 transition-colors"
      >
        <span className="text-left font-semibold text-gray-800">
          {item.question}
        </span>
        <svg
          className={`w-5 h-5 text-purple-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-transparent text-gray-700 leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

function AboutPage() {
  const [openFAQId, setOpenFAQId] = useState<number | null>(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">About ReCommerce Platform</h1>
          <p className="text-xl text-purple-100 max-w-2xl">
            Discover a smarter way to buy and sell pre-owned products. Join our
            community of millions who believe in quality, sustainability, and
            great value.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-700 mb-4 text-lg">
                We're committed to revolutionizing the way people buy and sell
                products. Our platform empowers individuals and businesses to
                extend product lifecycles, reduce waste, and build a more
                sustainable future.
              </p>
              <p className="text-gray-700 text-lg">
                By making recommerce accessible and trustworthy, we're creating
                economic value while protecting our planet.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg p-8 text-white">
              <div className="text-5xl font-bold mb-4">100+</div>
              <div className="text-xl mb-6">Active Users</div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-white rounded-full mr-3"></span>
                  <span>Trusted Platform</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-white rounded-full mr-3"></span>
                  <span>Verified Sellers</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-white rounded-full mr-3"></span>
                  <span>Secure Transactions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose ReCommerce?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '✓',
                title: 'Quality Assured',
                description:
                  'Every item is verified for authenticity and quality before reaching your doorstep.',
              },
              {
                icon: '🛡',
                title: 'Secure & Safe',
                description:
                  'Your transactions are protected with our buyer protection guarantee.',
              },
              {
                icon: '🌍',
                title: 'Sustainable',
                description:
                  'Join us in reducing waste and building a circular economy.',
              },
              {
                icon: '💰',
                title: 'Great Deals',
                description:
                  "Find amazing products at prices that won't break the bank.",
              },
              {
                icon: '📦',
                title: 'Fast Shipping',
                description:
                  'Quick and reliable delivery with tracking for all orders.',
              },
              {
                icon: '⭐',
                title: '24/7 Support',
                description:
                  'Our customer support team is always ready to help you.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="border-2 border-purple-200 rounded-lg p-6 hover:border-purple-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-lg shadow-md border border-purple-100">
            {faqData.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openFAQId === item.id}
                onToggle={() =>
                  setOpenFAQId(openFAQId === item.id ? null : item.id)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-4">
            © 2025 ReCommerce Platform. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
