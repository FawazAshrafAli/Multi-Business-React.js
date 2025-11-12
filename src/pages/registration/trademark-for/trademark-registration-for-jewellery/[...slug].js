// pages/registration/[...slug].js
export async function getServerSideProps({ params }) {
  let slug = params.slug || [];  

  const destination = "/startupindia/service/trademark/trademark-registration-for-jewellery/" + slug.join("/");

  return {
    redirect: {
      destination,
      permanent: true,
    },
  };
}

export default function TrademarkForRedirect() {
  return null;
}
