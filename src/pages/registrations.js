export async function getServerSideProps() {
  const destination = "/delhi/startup-services";

  return {
    redirect: {
      destination,
      permanent: true, 
    },
  };
}

export default function RegistrationsRedirect() {
  return null;
}
