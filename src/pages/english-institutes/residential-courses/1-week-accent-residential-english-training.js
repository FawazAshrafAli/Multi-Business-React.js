export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/residential-courses/accent-residential-english-training",
            permanent: true,
        },
    }
}

export default function WeekAccentCoursesRedirect() {
    return null;
}