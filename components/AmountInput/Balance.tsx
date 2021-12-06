import React, { FC } from "react";
import { Box, Text, Flex, chakra } from "@chakra-ui/react";
import { fromTerraAmount, useBalance } from "@arthuryeti/terra";

import { useTokenInfo } from "modules/common";
import { lookup, formatAsset } from "libs/parse";

type Props = {
  asset: string;
  label?: string;
  initial?: string;
  onChange: (value: string) => void;
};

const Balance: FC<Props> = ({
  asset,
  initial,
  label = "In Wallet",
  onChange,
}) => {
  const { getSymbol } = useTokenInfo();
  const balance = useBalance(asset);
  const amount = fromTerraAmount(initial ?? balance, "0.00[0000]");

  return (
    <Flex align="center" justify="space-between" mt="1">
      <Box>
        <Text>
          <Text as="span" fontSize="sm" fontWeight="500" color="white.400">
            {label}:
          </Text>{" "}
          <Text as="span" fontSize="sm" color="white" ml="2">
            {formatAsset(initial ?? balance, getSymbol(asset))}
          </Text>
        </Text>
      </Box>
      <Box>
        <chakra.button
          type="button"
          outline="none"
          color="white.600"
          fontSize="xs"
          textTransform="uppercase"
          bg="white.100"
          fontWeight="bold"
          px="3"
          borderRadius="md"
          letterSpacing="widest"
          onClick={() => onChange(amount)}
        >
          Max
        </chakra.button>
      </Box>
    </Flex>
  );
};

export default Balance;
