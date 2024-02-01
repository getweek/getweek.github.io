import React, { useEffect } from "react";
import { App } from "../App";
import { animated, useSpring, useSpringRef, useChain } from "@react-spring/web";
import styled from "styled-components";

export const Demo = () => {
  const firstRef = useSpringRef();
  const secondRef = useSpringRef();
  const thirdRef = useSpringRef();

  const heading1Styles = useSpring({
    ref: firstRef,
    from: { opacity: 0, transform: "translate3d(0, -40px, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    delay: 1000,
    config: { duration: 1000 },
  });
  
  const heading2Styles = useSpring({
    ref: secondRef,
    from: { opacity: 0, transform: "translate3d(0, -40px, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    delay: 2500,
    config: { duration: 1000 },
  });
  
  const heading3Styles = useSpring({
    ref: thirdRef,
    from: { opacity: 0, transform: "translate3d(0, -40px, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    delay: 2000,
    config: { duration: 1000 },
  });
  
  useChain([firstRef, secondRef, thirdRef]);

  return (
    <div>
      <Heading2 style={heading1Styles}>
        We can't get back the wasted time.
      </Heading2>
      <Heading2 style={heading2Styles}>
        But we can help you waste less.
      </Heading2>
      <Info style={heading3Styles}>
        <strong>Week</strong> is a calendar and task manager app
        <br /> for individuals who aspire to accomplish more.
        <App />
      </Info>
    </div>
  );
};

const Heading2 = styled(animated.h2)`
  text-align: center;
`;

const Info = styled(animated.div)`
  text-align: center;
`;