// pages/registration/[...slug].js
export async function getServerSideProps({ params }) {
  let slug = params.slug || [];

  if (slug.length > 0 && slug?.[0] === "k-swift-registration-consultants") {
    slug[0] = "k-swift-license-registration"
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
