export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/startupindia/service/trademark",
            permanent: true,
        },
    }
}

export default function TrademarkRedirect() {
    return null;
}