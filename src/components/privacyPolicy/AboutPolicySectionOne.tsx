import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const AboutTOSSectionOne = () => {
  const List = ({ text }) => (
    <p className="mb-5 flex items-center text-lg font-medium text-body-color">
      <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
        {checkIcon}
      </span>
      {text}
    </p>
  );

  return (
    <section id="tos" className="pt-16 md:pt-20 lg:pt-28">
      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <SectionTitle
                title="PRIVACY & DISCLAIMER"
                paragraph="
Parth Microsys is committed to respecting and protecting your privacy on our website. This privacy policy is designed to provide you an outline of, what personal information is collected from you and why.


What information do we collect?
-We collect information such as your name, organization name, email address, telephone numbers, mobile number, fax number, physical address, postal address, IP address and other contact or project related information for internal use only.
How information is collected?
-The information may be collected via our website by any technology used on our web- site for example the contact us form or a Quote request form.We may also collect per- sonal information via telephone, letter, promotional materials or at any function or event when meeting with a Parth Microsys representative.
Why collect information?
-Our primary goal in collecting your personal information is to provide you with a profes- sional, efficient and personalized service.
Using personal information:
-We may use your personal information to communicate with you via emails, telephone, newsletters, and direct mails. We may also use it to provide important updates, for invita- tions or for any other administrative purpose.
Sharing your information:
We may share your personal information on a need-to-know basis within our company. We may also share your information with our sub-contractors or our suppliers with whom we have signed a confidentiality agreement. We will not sell, lease or distribute your personal information to any third-party organization without prior consent. We reserve the right to reveal your information in extreme or out-of-ordinary circumstances or for health or safety reasons or as required by the legal authorities.
"
                mb="44px"
              />
              </div>

            <div className="w-full px-4 lg:w-1/2">
              <div className="relative mx-auto aspect-[25/24] max-w-[500px] lg:mr-0">
                <Image
                  src="/images/about/about-image.svg"
                  alt="about-image"
                  fill
                  className="mx-auto max-w-full drop-shadow-three dark:hidden dark:drop-shadow-none lg:mr-0"
                />
                <Image
                  src="/images/about/about-image-dark.svg"
                  alt="about-image"
                  fill
                  className="mx-auto hidden max-w-full drop-shadow-three dark:block dark:drop-shadow-none lg:mr-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTOSSectionOne;
