export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/startupindia/service/bis-hallmark",
            permanent: true,
        },
    }
}

export default function BisRedirect() {
    return null;
}