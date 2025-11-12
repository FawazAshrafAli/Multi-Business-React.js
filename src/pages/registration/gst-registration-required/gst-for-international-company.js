export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/startupindia/service/gst/gst-registration-for-international-company",
      permanent: true,
    },
  };
}

export default function GstInternationalRedirect() {
  return null;
}
