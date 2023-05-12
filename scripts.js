async function fetchNotionData() {
  const databaseId = "222230cd10754cddb5745639ed429211"; // 你的 Notion 数据库 ID
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
          "Authorization": `Bearer secret_jE9mwRlSP3PRAkhganBnVpxVeHV8r8ALlFGlLtVxHPy`, // 你的 Notion Integration Token
          "Notion-Version": "2021-08-16"
      },
      body: JSON.stringify({ page_size: 100 }) // 设置获取的数据量，你可以根据需要调整
  });
  
  const data = await response.json();
  return data.results; // 返回结果中的数据部分
}

function createBrandLink(brand) {
  const brandLink = document.createElement('a');
  brandLink.href = brand.url;
  brandLink.textContent = brand.name;
  return brandLink;
}

window.onload = async function() {
  const brands = await fetchNotionData();
  const brandList = document.getElementById('brand-list');

  for (let brand of brands) {
      const brandLink = createBrandLink(brand);
      brandList.appendChild(brandLink);
  }
};
