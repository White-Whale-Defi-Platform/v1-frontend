import { useMemo } from "react";
import { fromTerraAmount, useTerraWebapp, useBalance } from "@arthuryeti/terra";
import { NextPage } from "next";
import numeral from "numeral";

import contracts from "constants/contracts.json";
import { useVault } from "modules/vault";
import { useGovStaked } from "modules/govern";
import { times, div } from "libs/math";
import { useWhalePrice } from "hooks/useWhalePrice";
import { ONE_TOKEN } from "constants/constants";
import { useLpHolding } from "hooks/useLpHolding";

import PieGraphCard from "components/myPage/PieGraphCard";

const MyAssets: NextPage = () => {
  const {
    network: { name },
  } = useTerraWebapp();
  const price = useWhalePrice();
  const stakedAmount = useGovStaked();
  const lpHolding = useLpHolding();
  const { balance } = useVault({
    contract: contracts[name].ustVault,
  });

  const whaleAmount = useMemo(() => {
    if (stakedAmount == null) {
      return null;
    }

    return times(stakedAmount, div(price, ONE_TOKEN));
  }, [stakedAmount, price]);

  const ustBalance = useBalance("uusd");
  const total = numeral(balance).add(ustBalance).value().toString();

  const data = [
    {
      label: "Arb Vault holdings",
      value: Number(balance),
      color: "#3CCD64",
    },
    {
      label: "War Chest",
      value: Number(whaleAmount),
      color: "#194325",
    },
    {
      label: "LP holding",
      value: Number(lpHolding),
      color: "#111111",
    },
    {
      label: "Liquid UST",
      value: Number(ustBalance),
      color: "#2E78E9",
    },
  ];

  return (
    <PieGraphCard
      title="My Assets"
      value={fromTerraAmount(total)}
      asset="UST"
      data={data}
    />
  );
};

export default MyAssets;
