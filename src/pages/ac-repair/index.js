// pages/registration/[...slug].js
export async function getServerSideProps() {
  const destination = "/ac-service/";

  return {
    redirect: {
      destination,
      permanent: true, // set to false if temporary
    },
  };
}

export default function RegistrationRedirect() {
  return null;
}
