export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/startupindia/iso-certification",
      permanent: true,
    },
  };
}

export default function IsoCertificationRedirect() {
  return null;
}
