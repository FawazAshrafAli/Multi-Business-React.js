export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/online-courses/live-spoken-english-video-classes",
            permanent: true,
        },
    }
}

export default function LiveSpokenEnglishRedirect() {
    return null;
}
