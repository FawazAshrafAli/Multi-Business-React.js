export async function getServerSideProps() {
  const destination = "/delhi/more-services";

  return {
    redirect: {
      destination,
      permanent: true, 
    },
  };
}

export default function ServicesRedirect() {
  return null;
}
