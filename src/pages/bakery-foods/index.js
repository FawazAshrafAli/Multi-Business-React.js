// pages/registration/[...slug].js
export async function getServerSideProps() {
  const destination = "/bakery/";

  return {
    redirect: {
      destination,
      permanent: true, // set to false if temporary
    },
  };
}

export default function BakeryFoodsRedirect() {
  return null;
}
