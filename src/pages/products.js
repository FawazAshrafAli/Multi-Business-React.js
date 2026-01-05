export async function getServerSideProps() {
  const destination = "/delhi/more-products";

  return {
    redirect: {
      destination,
      permanent: true, 
    },
  };
}

export default function ProductsRedirect() {
  return null;
}
