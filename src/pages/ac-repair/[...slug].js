// pages/registration/[...slug].js
export async function getServerSideProps({ params }) {
  let slug = params.slug || [];

  if (slug.length > 0 && slug?.[0]?.startsWith("ac-air-conditioner-repairing-and-services")) {
    slug[0] = slug[0].replace("ac-air-conditioner-repairing-and-services", "ac-repair-service-in");   
  }

  const destination = "/ac-service/" + slug.join("/");

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
