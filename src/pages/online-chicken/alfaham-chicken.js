export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/buy-chicken/products/alfaham-chicken",
      permanent: true,
    },
  };
}

export default function AlfahamChickenRedirect() {
  return null;
}
