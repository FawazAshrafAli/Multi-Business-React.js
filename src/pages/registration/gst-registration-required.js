export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/startupindia/service/gst",
      permanent: true,
    },
  };
}

export default function GstRedirect() {
  return null;
}
