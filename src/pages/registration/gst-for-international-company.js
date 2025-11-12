export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/startupindia/gst-registration-for-international-company",
      permanent: true,
    },
  };
}

export default function GstInternationalRedirect() {
  return null;
}
