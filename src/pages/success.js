import SeoHead from "../../components/SeoHead";
import axios from "axios";
import OrderSuccess from "../../components/user/OrderSuccess";

export default function successPage({
  homeContent = {},
  blogs = [],
  user,
  recentOrder
}) {
  return (
    <>
      <SeoHead
        meta_description={homeContent?.meta_description}
        meta_title="Success! Order Placed!"
        metaTags={[]}
        blogs={blogs}
        url="https://bzindia.in/success"
      />      

      <OrderSuccess user={user} recentOrder={recentOrder}/>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const cookie = req.headers.cookie || "";

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

    let recentOrder;

    if (userChecked && user) {
      try {
        const recentOrderRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product_api/order/recent`, {
          headers: { cookie },
          withCredentials: true,
        });
        recentOrder = recentOrderRes?.data;
      
      } catch (err) {
        console.error(err)

        const responseData = err.response?.data;        

        if (responseData?.expired === true) {
          return {
            redirect: {
              destination: "/orders",
              permanent: false,
            },
          };
        }
      }
    }

    return {
      props: {
        user,
        homeContent: {},
        blogs: [],
        recentOrder: recentOrder?? null,
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
