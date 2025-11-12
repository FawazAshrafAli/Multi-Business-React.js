export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/buy-chicken/products/meat-cutlets",
      permanent: true,
    },
  };
}

export default function MeatCutletsRedirect() {
  return null;
}
