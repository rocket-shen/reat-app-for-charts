import Papa from "papaparse";

const loadFileData = (filename) => {
  return fetch(filename)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }
      return response.text();
    })
    .catch((error) => {
      console.error("Error loading file:", error);
      throw error;
    });
};

const parseCsv = (csv, transform = (value) => value) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: (header) => header.trim().replace(/^"|"$/g, ""),
      transform,
      complete: resolve,
      error: reject,
    });
  });
};

export const loadData = async (balanceSheetFilename, incomeStatementFilename) => {
  try {
    const [balanceSheetCsv, incomeStatementCsv] = await Promise.all([
      loadFileData(balanceSheetFilename),
      loadFileData(incomeStatementFilename),
    ]);

    const balanceResults = await parseCsv(balanceSheetCsv, (value, header) => {
      let cleaned = value.trim().replace(/^"|"$/g, "");
      if (
        [
          "货币资金",
          "交易性金融资产",
          "应收票据及应收账款",
          "流动资产合计",
          "非流动资产合计",
          "资产合计",
          "流动负债合计",
          "非流动负债合计",
          "负债合计",
          "股东权益合计",
        ].includes(header)
      ) {
        return parseFloat(cleaned) || 0;
      }
      return cleaned;
    });

    const incomeResults = await parseCsv(incomeStatementCsv, (value, header) => {
      let cleaned = value.trim().replace(/^"|"$/g, "");
      if ([
        "其中：营业收入",
        "其中：营业成本",
        "净利润",
        "归属于母公司股东的净利润"
      ] .includes(header))
       {
        return parseFloat(cleaned) || 0;
      }
      return cleaned;
    });

    const balanceData = balanceResults.data.map((row) => ({
      报告期: new Date(row["报告期"]),
      货币资金: parseFloat(row["货币资金"]) || 0,
      交易性金融资产: parseFloat(row["交易性金融资产"]) || 0,
      应收票据及应收账款: parseFloat(row["应收票据及应收账款"]) || 0,
      流动资产合计: parseFloat(row["流动资产合计"]) || 0,
      非流动资产合计: parseFloat(row["非流动资产合计"]) || 0,
      资产合计: parseFloat(row["资产合计"]) || 0,
      流动负债合计: parseFloat(row["流动负债合计"]) || 0,
      非流动负债合计: parseFloat(row["非流动负债合计"]) || 0,
      负债合计: parseFloat(row["负债合计"]) || 0,
      股东权益合计: parseFloat(row["股东权益合计"]) || 0,
    }));

    const incomeData = incomeResults.data.map((row) => ({
      报告期: new Date(row["报告期"]),
      营业收入: parseFloat(row["其中：营业收入"]) || 0,
      营业成本: parseFloat(row["其中：营业成本"]) || 0,
      归母净利润: parseFloat(row["归属于母公司股东的净利润"]) || 0,
      净利润: parseFloat(row["净利润"]) || 0,
    }));

    const mergedData = balanceData
      .map((balanceRow) => {
        const incomeRow = incomeData.find(
          (income) =>
            income["报告期"].toISOString() ===
            balanceRow["报告期"].toISOString()
        );
        if (incomeRow) {
          return {
            ...balanceRow,
            净利润: incomeRow["净利润"],
            归母净利润: incomeRow["归母净利润"],
            营业收入: incomeRow["营业收入"],
            营业成本: incomeRow["营业成本"],
            ROA: balanceRow["资产合计"]
              ? ((incomeRow["净利润"] / balanceRow["资产合计"]) * 100).toFixed(2)
              : 0,
            ROE: balanceRow["股东权益合计"]
              ? ((incomeRow["净利润"] / balanceRow["股东权益合计"]) * 100).toFixed(2)
              : 0,
          };
        }
        return null;
      })
      .filter((row) => row !== null)
      .sort((a, b) => a["报告期"] - b["报告期"]);

    return mergedData;
  } catch (error) {
    console.error("Error loading or parsing data:", error);
    throw error;
  }
};
