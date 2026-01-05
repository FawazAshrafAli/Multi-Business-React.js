export async function getServerSideProps() {
  const destination = "/delhi/more-courses";

  return {
    redirect: {
      destination,
      permanent: true, 
    },
  };
}

export default function CoursesRedirect() {
  return null;
}
