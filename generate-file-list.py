import os
import json
from pathlib import Path

def generate_file_list():
    # 设置public文件夹路径
    public_dir = Path(__file__).parent / "public"
    
    # 查找所有.csv文件
    csv_files = []
    for root, dirs, files in os.walk(public_dir):
        for file in files:
            if file.lower().endswith('.csv'):
                # 只记录文件名，不包含路径
                csv_files.append(file)
    
    # 按文件名排序
    csv_files.sort()
    
    # 生成file-list.json路径
    output_path = public_dir / "file-list.json"
    
    # 写入JSON文件
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(csv_files, f, ensure_ascii=False, indent=2)
    
    print(f"成功生成 file-list.json，包含 {len(csv_files)} 个CSV文件")
    print(f"文件已保存到: {output_path}")

if __name__ == "__main__":
    generate_file_list()