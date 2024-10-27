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
                title="PROJECT TERMS"
                paragraph="-
All estimates/quotes are based on our understanding of your requirements and as per given time-frame. Any changes to the functionality, may incur additional costs accordingly. Please ensure and clarify our understanding in a face to face meeting.
-
By accepting a quote, you agree to and accept the terms and conditions of Parth Microsys. Acceptance can be verbal, by email, payment of Initiation, signing a quote.
-
Clients to ensure that we have included all requirements in the quotes/proposals/estimates and that we fully understand their requirements. Clients must provide us with clear guidelines along with the flow or specific details they may require. When such details are not provided, we will proceed with our understanding of the requirements and quote accordingly. At a later stage, if a discrepancy arises, it may lead to additional costs to accommodate the changes. Thus, it is essential that you clarify every aspect of your website development and ensure that you have been quoted on the right requirements.
-
Any complexity related to specific tasks, must be advised in advance and included in the proposal for costing purposes. We operate in good faith and rely on our clients to disclose the full picture at the time of quotation. Any discrepancy arising due to unclear requirements will not be borne by Parth Microsys.
-
Parth Microsys will make every effort to complete the project/changes in the given timeframe. Reasonable delays are accepted if functionalities are redefined or modified.
-
Any delays at client’s end, may delay the project and proposed timeframes.
-
Any bugs (programming errors) reported during or after the development does not attract additional charges.

-
Our websites/applications are generally tested on PCs and include near recent versions of following browsers: IE, Firefox, Chrome & Safari. If you require testing to be done on any
other browser, please let us know in advance-.
-
Responsive/multi-device compatible web pages are tested on iPhone and iPads. If you require testing to be done on any other device, please discuss it in advance.
-
Depending upon the functionalities required, there may be 3rd party components such as Third Party Payment Gateways or SSL certificates involved in building a website.
Although Parth Microsys does its best in recognizing the suitability of any such component, any unforeseen limitations of 3rd party components are beyond our control. Any third-party component purchase costs (such as SSL, Payment gateway, Google Adwords, Plug-in licenses, chat plugin etc) are not included in our quotes.
-
Domain registration/renewal etc charges are not included as a part of any project/proposal unless mentioned otherwise. If required, a quote for which will be submitted separately and approved by the client.
-
Hosting charges are not included in the quotations unless mentioned otherwise. Parth Microsys can organise an appropriate hosting solution if required, a quote for which will be submitted separately and approved by the client. Where clients decide to organise their own hosting, we should be consulted before finalising the type of hosting and database, as it should meet the requirements of the technology used for the development. Please note that we’ll require full access with hosting support for testing and deploying the website. Parth Microsys will not be liable for any delays or errors caused by direct or indirect actions of the hosting company.


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
