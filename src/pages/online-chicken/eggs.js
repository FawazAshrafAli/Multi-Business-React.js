export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/buy-chicken/products/chicken-eggs",
      permanent: true,
    },
  };
}

export default function EggsRedirect() {
  return null;
}
