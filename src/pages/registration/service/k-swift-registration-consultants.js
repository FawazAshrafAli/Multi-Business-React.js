export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/startupindia/k-swift-license-registration",
            permanent: true,
        },
    }
}

export default function KSwiftRegistrationRedirect() {
    return null;
}