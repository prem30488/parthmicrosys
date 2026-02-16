"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { sendEmail } from "../../lib/actions";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // ✅ prevents page reload

    if (loading) return; // extra safety

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await sendEmail(formData);

    setLoading(false);

    if (result.success) {
      e.currentTarget.reset();
      toast.success("Message sent successfully!");

    } else {
      toast.error("Something went wrong.");
    }
    e.currentTarget.reset();
  }

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px]">

              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white">
                Waiting for you to contact us. Allow me to take a cup of tea or coffee ...
              </h2>

              <p className="mb-12 text-base font-medium text-body-color">
                Our team will get back to you ASAP via email.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">

                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label className="mb-3 block text-sm font-medium">
                        Your Good Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        required
                        className="w-full rounded-sm border bg-[#f8f8f8] px-6 py-3"
                      />
                    </div>
                  </div>

                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label className="mb-3 block text-sm font-medium">
                        Your Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-sm border bg-[#f8f8f8] px-6 py-3"
                      />
                    </div>
                  </div>

                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label className="mb-3 block text-sm font-medium">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        className="w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3"
                      ></textarea>
                    </div>
                  </div>

                  <div className="w-full px-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`rounded-sm px-9 py-4 text-base font-medium text-white duration-300 ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90"
                        }`}
                    >
                      {loading ? "Sending..." : "Submit"}
                    </button>
                  </div>

                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
