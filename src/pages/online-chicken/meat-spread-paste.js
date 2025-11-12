export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/buy-chicken/products/chicken-spread",
      permanent: true,
    },
  };
}

export default function MeatSpreadPasteRedirect() {
  return null;
}
