// pages/ac-service/brands.js
export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/ac-service/air-conditioner/brands",
      permanent: true,
    },
  };
}

export default function BrandsRedirect() {
  return null;
}
