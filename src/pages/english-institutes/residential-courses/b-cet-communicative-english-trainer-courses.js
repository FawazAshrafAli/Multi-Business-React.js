export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/residential-courses/communicative-english-trainer-course",
            permanent: true,
        },
    }
}

export default function CommunicativeEnglishRedirect() {
    return null;
}