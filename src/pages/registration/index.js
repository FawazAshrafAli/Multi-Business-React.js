export async function getServerSideProps() {
  const destination = "/startupindia/";

  return {
    redirect: {
      destination,
      permanent: true, 
    },
  };
}

export default function RegistrationRedirect() {
  return null;
}
