export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/onsite-courses/accent-english-training-for-students",
            permanent: true,
        },
    }
}

export default function AccentTrainingRedirect() {
    return null;
}