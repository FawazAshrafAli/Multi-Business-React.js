export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/residential-courses/residential-ielts-english-training-institutes",
            permanent: true,
        },
    }
}

export default function ResidentialIeltsCoursesRedirect() {
    return null;
}