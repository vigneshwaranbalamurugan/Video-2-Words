
import Head from "next/head";
import Homepage from "../components/home";
import MainWorkflow from "../components/mainworkflow";
import Footer from "../components/footer";

export default function Home() {
  return (
  <>
     <Head>
        <title>Video2Words</title>
        <meta name="description" content="Welcome to my awesome website built with Next.js" />
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/video2words.jpeg" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/video2words.jpeg" />
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" /> */}
      </Head>
  <Homepage/>
  <MainWorkflow/>
  <Footer/>
  </>
  );
}
