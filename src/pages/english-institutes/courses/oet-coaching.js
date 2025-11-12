export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/regular-courses/oet-coaching-classes-regular",
            permanent: true,
        },
    }
}

export default function OetCoachingRedirect() {
    return null;
}
