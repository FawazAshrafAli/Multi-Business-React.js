export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/ac-service/air-conditioner/repair-services",
      permanent: true,
    },
  };
}

export default function ServicesRedirect() {
  return null;
}
