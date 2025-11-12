export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/regular-courses/communicative-english-program-regular-class",
            permanent: true,
        },
    }
}

export default function CommunicativeEnglishRedirect() {
    return null;
}
