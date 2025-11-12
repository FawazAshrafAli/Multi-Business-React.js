// pages/registration/[...slug].js
export async function getServerSideProps() {
  const destination = "/startupindia/service/trademark/trademark-registration-for-jewellery/";

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
