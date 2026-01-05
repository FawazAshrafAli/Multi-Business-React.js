import axios from "axios";
import SeoHead from "../../components/SeoHead"
import ConfirmAndPay from "../../components/user/ConfirmAndPay";

export default function ConfirmAndPayPage({
  homeContent = {},
  blogs = [],
  user
}) {    
    return (
      <>
        <SeoHead
            meta_description={homeContent?.meta_description}
            meta_title="Confirm And Pay"
            metaTags={[]}
            blogs={blogs}
            url="https://bzindia.in/confirm-pay"
        />
        
        <ConfirmAndPay user={user} />
      </>
    )
}

export async function getServerSideProps(context) {
    const {req} = context;
    const cookie = req.headers.cookie || "";

    let userChecked = false;

    try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth_api/user/`, {
      headers: { cookie },
      withCredentials: true,
    });

    const user = res.data || null;

    userChecked = true;

    if (userChecked && !user) {
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
        structuredData: [],
        homeContent: {},
        blogs: [],
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
