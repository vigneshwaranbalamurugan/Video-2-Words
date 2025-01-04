import Head from "next/head";

const HeadComponent = () => {
    return (
        <Head>
        <title>Video2Words</title>
        <meta name="description" content="Welcome to my awesome website built with Next.js" />
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/video2words.jpeg" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/video2words.jpeg" />
        <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Exo:wght@400;700&display=swap"
        rel="stylesheet"
      />
      </Head>
    )
};

export default HeadComponent;