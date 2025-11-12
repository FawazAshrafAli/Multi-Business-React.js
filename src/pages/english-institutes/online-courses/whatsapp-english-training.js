export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/english-institutes/courses/online-courses/whatsapp-english-courses-training",
            permanent: true,
        },
    }
}

export default function WhatsAppEnglishRedirect() {
    return null;
}
