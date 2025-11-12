// pages/registration/[...slug].js
export async function getServerSideProps({ params }) {
  const slug = params.slug || []; 
  
  if (slug.length > 0 && slug?.[0]?.startsWith("spices-board-license-registration-consultants-in-")) {
    slug[0] = slug[0].replace("-license", "").replace("-consultants", "");   
  }    

  const destination = "/startupindia/" + slug.join("/");

  return {
    redirect: {
      destination,
      permanent: true, // set to false if temporary
    },
  };
}

export default function RegistrationRedirect() {
  return null;
}