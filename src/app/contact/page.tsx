import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page | Parth Microsys",
  description: "Parth Microsys",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact us"
        description="Contact us and share your idea you want to build. We hope we can help you."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
