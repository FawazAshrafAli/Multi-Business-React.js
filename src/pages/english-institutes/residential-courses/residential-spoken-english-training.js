export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/residential-courses/residential-spoken-english-training",
            permanent: true,
        },
    }
}

export default function ResidentialCoursesRedirect() {
    return null;
}
