export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/online-courses/ielts-online-live-classes",
            permanent: true,
        },
    }
}

export default function IeltsLiveRedirect() {
    return null;
}
