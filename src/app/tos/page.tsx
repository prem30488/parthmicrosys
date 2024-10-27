import AboutTOSSectionThree from "@/components/tos/AboutTOSSectionThree";
import AboutTOSSectionTwo from "@/components/tos/AboutTOSSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";
import AboutTOSSectionOne from "@/components/tos/AboutTOSSectionOne";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Page | Parth Microsys",
  description: "About Parth Microsys - Terms of Service",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Parth Microsys - Terms of Service"
        description="Parth Microsys is a micro level company registered at MSME, India. Parth Microsys 
        provide engineering services in various key areas such as GIS, MIS, ERP, Startup partners etc.
        Core values of Parth Microsys are - Transition from me to we. At Parth Microsys engineers are
        working for products mainly available to end user with user friendly interface and protected against 
        various kind of attacks. We focus more on protection and error free output meeting the standard need of client.
        Parth Microsys is one venture to provide help to those people who collaborate with us for Information and Technology
        needs such as coding, analysis, marketing , design, deployment, MIS reports, updates, converting requirements to software etc. "
      />
      <AboutTOSSectionOne />
      <AboutTOSSectionTwo />
      <AboutTOSSectionThree />
    </>
  );
};

export default AboutPage;
