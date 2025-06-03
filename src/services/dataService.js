import Papa from 'papaparse';

const loadFileData = (filename) => {
    return fetch(filename)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load file: ${response.statusText}`);
            }
            return response.text();
        })
        .catch(error => {
            console.error('Error loading file:', error);
            throw error;
        });
};

export const loadData = () => {
    return loadFileData("SZ002588_史丹利_资产负债表.csv").then(csv => {
        return new Promise((resolve, reject) => {
            Papa.parse(csv, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: false,
                transformHeader: (header) => header.trim().replace(/^"|"$/g, ''),
                transform: (value, header) => {
                    let cleaned = value.trim().replace(/^"|"$/g, '');
                    if (['货币资金', '交易性金融资产', '应收票据及应收账款', '流动资产合计', '非流动资产合计', '资产合计', '流动负债合计', '非流动负债合计', '负债合计', '股东权益合计'].includes(header)) {
                        return parseFloat(cleaned) || 0;
                    }
                    return cleaned;
                },
                complete: (results) => {
                    const cleanedData = results.data.map(row => ({
                        报告期: new Date(row['报告期']),
                        货币资金: parseFloat(row['货币资金']) || 0,
                        交易性金融资产: parseFloat(row['交易性金融资产']) || 0,
                        应收票据及应收账款: parseFloat(row['应收票据及应收账款']) || 0,
                        流动资产合计: parseFloat(row['流动资产合计']) || 0,
                        非流动资产合计: parseFloat(row['非流动资产合计']) || 0,
                        资产合计: parseFloat(row['资产合计']) || 0,
                        流动负债合计: parseFloat(row['流动负债合计']) || 0,
                        非流动负债合计: parseFloat(row['非流动负债合计']) || 0,
                        负债合计: parseFloat(row['负债合计']) || 0,
                        股东权益合计: parseFloat(row['股东权益合计']) || 0,
                    })).sort((a, b) => a['报告期'] - b['报告期']);
                    resolve(cleanedData);
                },
                error: (err) => {
                    console.error(err);
                    reject(err);
                }
            });
        });
    });
};