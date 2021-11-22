import React from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  Image,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";

import CardHeader from "components/CardHeader";
import Card from "components/Card";
import SearchIcon from "components/icons/SearchIcon";

const AstroAirdrop = () => {
  return (
    <Box>
      <CardHeader label="ASTRO Airdrop" />
      <Card px={["6", null, null, "12"]} pt="12" pb="8">
        <Flex
          direction={["column", null, null, "row"]}
          align={["center", null, null, "flex-start"]}
          justify="space-between"
          mx="-5"
          flexWrap="wrap"
        >
          <Box px="5" flex="1">
            <Text fontWeight="500" fontSize="14px" mb="1">
              Check your eligibility:
            </Text>
            <Text variant="content" mb="3">
              LUNA stakers and Terraswap LPs are eligible for an ASTRO airdrop.
              Please use the input field below to check which of your Terra
              addresses qualify for the airdrop.
            </Text>
            <Box>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="white" opacity="0.4" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Paste your Terra address"
                  variant="filled"
                />
              </InputGroup>
              <Button variant="primary" width="192px" mt="6">
                Check
              </Button>
            </Box>
          </Box>
          <Box
            px="5"
            mt={["12", null, null, "-24"]}
            mb={["-24", null, null, "0"]}
          >
            <Image
              src="/astro-airdrop.png"
              srcset="/astro-airdrop@2x.png 2x"
              alt=""
            />
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

export default AstroAirdrop;
