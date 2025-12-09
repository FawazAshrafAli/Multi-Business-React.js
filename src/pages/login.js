import Head from "next/head";
import SeoHead from "../../components/SeoHead";
import CustomerLogin from "../../components/CustomerLogin";
import axios from "axios";


export default function LoginPage({
    homeContent={}, blogs=[], structuredData=[]
}) {
    return (
        <>
        <SeoHead
        meta_description={homeContent?.meta_description}
        meta_title="Customer Login"
        metaTags={[]}
        
        blogs={blogs}
        url="https://bzindia.in/login"
      />

      <Head>
          {structuredData.map((schema, i) => (
            <script key={i} type="application/ld+json">
              {schema}
            </script>
          ))}        
      </Head>

        <CustomerLogin/>
        </>
    )
}

export async function getServerSideProps(context) {
  const { req } = context;
  const cookie = req.headers.cookie || "";

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth_api/user/`,
      {
        headers: { cookie },
        withCredentials: true,
      }
    );

    const user = res.data || null;

    if (user) {
      return {
        redirect: {
          destination: "/cart",
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: null,
        structuredData: [],
        homeContent: {},
        blogs: [],
      },
    };
  } catch (err) {
    console.log("Auth check failed — showing login page");

    return {
      props: {
        user: null,
        structuredData: [],
        homeContent: {},
        blogs: [],
      },
    };
  }
}
