import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      title: 'Call Us',
      details: '+212 612 345 678',
      link: 'tel:+212612345678'
    },
    {
      icon: <Mail className="w-6 h-6 text-green-600" />,
      title: 'Email Us',
      details: 'support@greenbike.com',
      link: 'mailto:support@greenbike.com'
    },
    {
      icon: <MapPin className="w-6 h-6 text-green-600" />,
      title: 'Visit Us',
      details: '123 Green Avenue, Casablanca, Morocco',
      link: 'https://maps.google.com'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Banner */}
      <div className="bg-green-600 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl font-extrabold mb-6 animate-in fade-in slide-in-from-top-4 duration-700">Get in Touch</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto uppercase tracking-wide font-medium">
            Have questions about our bike fleet or reservations? We're here to help you start your journey.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full -mr-32 -mb-32 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Details Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Contact Information</h2>
              <div className="space-y-8">
                {contactInfo.map((info, idx) => (
                  <a
                    key={idx}
                    href={info.link}
                    className="flex items-start gap-4 group p-2 rounded-2xl hover:bg-green-50 transition-all duration-300"
                  >
                    <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{info.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{info.details}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Opening Hours
                </h3>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium text-gray-900">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-gray-900">09:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl flex flex-col items-center text-center">
              <Globe className="w-12 h-12 text-green-400 mb-4 animate-bounce" />
              <h3 className="text-xl font-bold mb-2">Social Network</h3>
              <p className="text-gray-400 text-sm mb-6">Stay updated with our latest offers and new bike arrivals.</p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">IG</div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">FB</div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">TW</div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-10 shadow-xl shadow-gray-200/50 border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-extrabold text-gray-900">Send us a message</h2>
              </div>

              {submitted ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Send className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 max-w-xs">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm resize-none"
                      placeholder="Your message details..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-green-600 text-white font-black text-lg rounded-2xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                  >
                    <span>Send Message</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
