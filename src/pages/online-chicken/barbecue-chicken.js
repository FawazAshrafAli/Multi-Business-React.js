export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/buy-chicken/products/barbecue-chicken",
      permanent: true,
    },
  };
}

export default function BarbecueChickenRedirect() {
  return null;
}
