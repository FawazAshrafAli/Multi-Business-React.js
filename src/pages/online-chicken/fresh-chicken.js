export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/buy-chicken/products/fresh-chicken",
      permanent: true,
    },
  };
}

export default function FreshChickenRedirect() {
  return null;
}
