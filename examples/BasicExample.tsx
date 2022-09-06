import * as React from "react";
import styled from "@emotion/styled";
import {RFTable} from "../react-frame-table";

interface Props {
}

function BasicExample(props: Props) {
  return <Container>
    <RFTable/>
  </Container>;
}

const Container = styled.div``;

export default BasicExample;
