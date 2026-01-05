import OrderDetail from "../../../components/user/OrderDetail";
import SeoHead from "../../../components/SeoHead";
import axios from "axios";

export default function ordersPage({
  homeContent = {},
  blogs = [],
  user,
  order,
}) {
  return (
    <>
      <SeoHead
        meta_description={homeContent?.meta_description}
        meta_title="Order"
        metaTags={[]}
        blogs={blogs}
        url={`https://bzindia.in/orders/${order?.slug}`}
      />      

        <OrderDetail user={user} order={order}/>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const cookie = req.headers.cookie || "";

  const {slug} = context.params;

  let userChecked = false;

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth_api/user/`, {
      headers: { cookie },
      withCredentials: true,
    });

    const user = res.data || null;

    userChecked = true;

    // 🔥 If no user → redirect BEFORE rendering
    if (userChecked && !user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const orderRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product_api/order/${slug}`, {
      headers: { cookie },
      withCredentials: true,
    });

    const order = orderRes.data || {};

    return {
      props: {
        user,
        homeContent: {},
        blogs: [],
        order: order || {},
        user: user || null,
      },
    };
  } catch (err) {
    console.error("No User");

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}
