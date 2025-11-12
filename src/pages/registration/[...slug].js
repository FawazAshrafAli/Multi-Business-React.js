// pages/registration/[...slug].js
export async function getServerSideProps({ params }) {
  let slug = params.slug || [];

  if (slug.length > 0 && slug?.[0] === "trademark-registration-consultants") {
    slug[0] = slug[0].replace("-consultants", "");   
  }

  if (slug.length > 0 && slug?.[0]?.startsWith("iso-certification-consultants")) {
    slug[0] = slug[0].replace("consultants", "in");   
  }  

  const destination = "/startupindia/" + slug.join("/");

  return {
    redirect: {
      destination,
      permanent: true,
    },
  };
}

export default function FssaiRedirect() {
  return null;
}
