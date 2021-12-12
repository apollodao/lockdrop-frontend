import React, { useMemo } from "react";
import { Box } from "@chakra-ui/react";

import { useAstroPools } from "modules/lockdrop";

import CardHeader from "components/CardHeader";
import CheckIcon from "components/icons/CheckIcon";
import Card from "components/Card";
import PoolTable from "components/auction/table/PoolTable";
import PoolNameTd from "components/auction/table/PoolNameTd";
import PoolTotalTd from "components/auction/table/PoolTotalTd";
import LockEndTd from "components/auction/table/LockEndTd";
import NumberTd from "components/auction/table/NumberTd";
import NumberWithUstTd from "components/auction/table/NumberWithUstTd";
import MyActionsTd from "components/auction/table/MyActionsTd";

const MyLockedAstroLiquidity = () => {
  const pools = useAstroPools();
  const columns = useMemo(
    () => [
      {
        Header: "Pool Name",
        Cell: ({ row }: any) => <PoolNameTd row={row} />,
        accessor: "name",
      },
      {
        Header: "Total Locked Liquidity",
        Cell: ({ row }: any) => (
          <NumberWithUstTd
            value={row.original.totalLiquidity}
            valueInUst={row.original.totalLiquidityInUst}
          />
        ),
        accessor: "totalLockedAstroportLiquidity",
      },
      {
        Header: "My Locked Liquidity",
        Cell: ({ row }: any) => (
          <NumberWithUstTd
            value={row.original.myLiquidity}
            valueInUst={row.original.myLiquidityInUst}
          />
        ),
        accessor: "myLiquidity",
      },
      {
        Header: "My Lock Ends",
        Cell: ({ row }: any) => <LockEndTd row={row} />,
        accessor: "lockEnd",
      },
      {
        Header: "Est. ASTRO Rewards",
        Cell: ({ row }: any) => <NumberTd value={row.original.astroRewards} />,
        accessor: "astroRewards",
      },
      {
        Header: "Dual Rewards",
        Cell: () => (
          <Box>
            <CheckIcon />
          </Box>
        ),
        accessor: "dualRewards",
        disableSortBy: true,
      },
      {
        Header: () => <Box width="167px" />,
        Cell: ({ row }: any) => (
          <MyActionsTd
            name={row.original.name}
            duration={row.original.duration}
          />
        ),
        accessor: "actions",
      },
    ],
    []
  );

  return (
    <Box>
      <CardHeader label="My Locked Astroport Liquidity" />
      <Card noPadding>
        <PoolTable columns={columns} data={pools} />
      </Card>
    </Box>
  );
};

export default MyLockedAstroLiquidity;
