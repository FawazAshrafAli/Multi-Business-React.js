import SeoHead from "../../components/SeoHead";
import Cart from "../../components/Cart";
import axios from "axios";

export default function cartPage({
  homeContent = {},
  blogs = [],
}) {
  return (
    <>
      <SeoHead
        meta_description={homeContent?.meta_description}
        meta_title="Cart"
        metaTags={[]}
        blogs={blogs}
        url="https://bzindia.in/cart"
      />      

      <Cart />
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const cookie = req.headers.cookie || "";

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth_api/user/`, {
      headers: { cookie },
      withCredentials: true,
    });

    const user = res.data || null;

    // 🔥 If no user → redirect BEFORE rendering
    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: {
        user,
        homeContent: {},
        blogs: [],
      },
    };
  } catch (err) {
    console.log("No User");

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}
