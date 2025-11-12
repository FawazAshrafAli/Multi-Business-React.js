export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/onsite-courses/business-english-training-courses",
            permanent: true,
        },
    }
}

export default function BusinessEnglishRedirect() {
    return null;
}