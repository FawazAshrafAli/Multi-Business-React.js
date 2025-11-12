export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/buy-chicken/products/tandoori-chicken",
      permanent: true,
    },
  };
}

export default function TandooriChickenRedirect() {
  return null;
}
