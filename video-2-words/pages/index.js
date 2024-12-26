
import Head from "next/head";
import Homepage from './home';
import MainWorkflow from './mainworkflow';
import Footer from './footer';
export default function Home() {
  return (
  <>
  <Head>
        <title>Video2Words</title>
        <meta name="description" content="Welcome to my awesome website built with Next.js" />
      </Head>
  <Homepage/>
  <MainWorkflow/>
  <Footer/>
  </>
  );
}
