export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/buy-chicken/products/grilled-chicken",
      permanent: true,
    },
  };
}

export default function GrilledChickenRedirect() {
  return null;
}
