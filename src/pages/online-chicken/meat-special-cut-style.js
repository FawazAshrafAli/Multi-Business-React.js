export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/buy-chicken/products/chicken-special-cut",
      permanent: true,
    },
  };
}

export default function MeatSpreadCutStyleRedirect() {
  return null;
}
