
import React from "react";
import { useState } from "react";
import HeadComponent from "@components/head";
import HomepageComponent from "@components/home";
import MainWorkflowComponent from "@components/mainworkflow";
import FooterComponent from "@components/footer";
import LauncherComponent from "@components/launcher";

export default function Home() {
  const [progress, setProgress] = useState(0);

  return (
  <>
      <HeadComponent/>
      {progress<100 && (
          <LauncherComponent 
          progress={progress} 
          setProgress={setProgress}/>
      )}
      { progress==100 && (
        <>
          <HomepageComponent/>
          <MainWorkflowComponent/>
          <FooterComponent/>
        </>
      )}
    </>
  );
}
