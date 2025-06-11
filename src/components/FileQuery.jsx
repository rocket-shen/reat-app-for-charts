import React, { useState, useEffect } from "react";

const FileQuery = ({ onFileLoaded }) => {
  const [securityCode, setSecurityCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableFiles, setAvailableFiles] = useState([]);

  // 获取public目录下所有CSV文件列表
  useEffect(() => {
    const fetchFileList = async () => {
      try {
        const response = await fetch('/file-list.json');
        if (!response.ok) {
          throw new Error('无法获取文件列表');
        }
        const files = await response.json();
        setAvailableFiles(files);
      } catch (error) {
        console.error("获取文件列表出错:", error);
        setError("获取可用文件列表失败");
      }
    };

    fetchFileList();
  }, []);

  // 根据证券代码查找匹配的文件
  const findMatchingFiles = (code) => {
    const prefix = code.toUpperCase();
    const matchedFiles = availableFiles.filter(file => 
      file.startsWith(prefix) && 
      (file.includes('_资产负债表') || file.includes('_利润表'))
    );
    
    // 分离资产负债表和利润表文件
    const balanceSheetFile = matchedFiles.find(f => f.includes('_资产负债表'));
    const incomeStatementFile = matchedFiles.find(f => f.includes('_利润表'));

     // 提取公司名称
     let companyName = "";
     if (balanceSheetFile) {
       const parts = balanceSheetFile.split('_');
       if (parts.length > 2) {
         companyName = parts[1]; // 假设公司名称是文件名的第二部分
       }
     }
    
    return {
      balanceSheetFile: balanceSheetFile ? `/public/${balanceSheetFile}` : null,
      incomeStatementFile: incomeStatementFile ? `/public/${incomeStatementFile}` : null,
      companyName: companyName
    };
  };

  const handleFileMatch = async () => {
    if (!securityCode.trim()) {
      setError("请输入证券代码");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 查找匹配的文件
      const { balanceSheetFile, incomeStatementFile, companyName } = findMatchingFiles(securityCode);
      
      if (!balanceSheetFile || !incomeStatementFile) {
        throw new Error(`找不到证券代码 ${securityCode} 对应的财务报表`);
      }

      // 将匹配到的文件路径传递给父组件
      onFileLoaded({
        balanceSheetFile,
        incomeStatementFile,
        companyName
      });
    } catch (error) {
      console.error("文件匹配出错:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-matcher-container">
      <h2>财务报表匹配</h2>
      <div className="input-code-container">
        <input
          type="text"
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
          placeholder="输入证券代码（如：SZ002588）"
          onKeyPress={(e) => e.key === 'Enter' && handleFileMatch()}
        />
        <button 
          onClick={handleFileMatch} 
          disabled={loading || !securityCode.trim()}
          className="match-button"
        >
          {loading ? "匹配中..." : "匹配文件"}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FileQuery;