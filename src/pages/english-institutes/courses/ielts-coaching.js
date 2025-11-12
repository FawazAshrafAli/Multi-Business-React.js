export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/regular-courses/ielts-coaching-classes-regular",
            permanent: true,
        },
    }
}

export default function IeltsCoachingRedirect() {
    return null;
}
