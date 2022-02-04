import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/layout";
import { Route, Switch } from "react-router-dom";
import { useRecoilState } from "recoil";
import { disclaimerAtom } from "../../recoil/disclaimer/atom";
import Footer from "./Footer";
import Header from "./Header";
import { Notifications } from "./Notifications";
import { YTC } from "../Pages/YTC";
import { Alert } from "../Reusable/Alert";
import { Users } from "components/Pages/Position/layout";
import FixedRatesPage from "components/Pages/FixedRates";

export const Layout = () => {
  const [open, setOpen] = useRecoilState(disclaimerAtom);

  return (
    <div>
      <Router>
        <Alert
          primaryText="This product is in beta:"
          secondaryText="The smart contracts are peer reviewed with formal audits coming soon, please use at your own risk."
          open={open}
          setOpen={setOpen}
        />
        <Flex
          bg="background"
          flexDir="column"
          justify="space-between"
          minH="100vh"
          py={{
            base: 4,
          }}
          px={{
            base: 1,
            md: 4,
          }}
        >
          <Header />
          <Box pt={4} px={1} mx="auto" maxW="lg" w="full" flexGrow={1}>
            <Switch>
              <Route path="/position">
                <Users />
              </Route>
              <Route path="/fixed">
                <FixedRatesPage/>
              </Route>
              <Route path="/">
                <YTC />
              </Route>
            </Switch>
          </Box>
          <Footer />
          <Notifications />
        </Flex>
      </Router>
    </div>
  );
};

export default Layout;
