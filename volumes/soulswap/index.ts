import { getChainVolume } from "../../helpers/getUniSubgraphVolume";
import { getStartTimestamp } from "../../helpers/getStartTimestamp";
import { FANTOM } from "../../helpers/chains";
import { SimpleAdapter } from "../../adapter.type";
import { Chain } from "@defillama/sdk/build/general";

const endpoints = {
// [AVAX]: "https://api.thegraph.com/subgraphs/name/soulswapfinance/avalanche-exchange
  [FANTOM]: "https://api.thegraph.com/subgraphs/name/soulswapfinance/fantom-exchange",
};

const VOLUME_FIELD = "volumeUSD";

const graphs = getChainVolume({
  graphUrls: {
    // [AVAX]: endpoints[AVAX],
    [FANTOM]: endpoints[FANTOM]
  },
  totalVolume: {
    factory: "factories",
    field: VOLUME_FIELD,
  },
  dailyVolume: {
    factory: "dayData",
    field: VOLUME_FIELD,
  },
});

const startTimeQuery = {
  endpoints,
  dailyDataField: "dayDatas",
  volumeField: VOLUME_FIELD,
};

const adapter: SimpleAdapter = {
  adapter: Object.keys(endpoints).reduce(
    (acc, chain) => ({
      ...acc,
      [chain]: {
        fetch: graphs(chain as Chain),
        start: getStartTimestamp({ ...startTimeQuery, chain }),
      },
    }),
    {}
  )
};

export default adapter;
