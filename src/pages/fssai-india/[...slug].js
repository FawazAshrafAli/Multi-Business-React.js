// pages/registration/[...slug].js
export async function getServerSideProps({ params }) {
  const slug = params.slug || []; 
  
  if (slug.length > 0 && slug?.[0]?.startsWith("fssai-registration-food-safety-license-certification-consultants")) {
    slug[0] = slug[0].replace("-certification-consultants", "");   
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
