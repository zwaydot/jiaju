const NOTION_API_KEY = 'secret_jE9mwRlSP3PRAkhganBnVpxVeHV8r8ALlFGlLtVxHPy'; // 请替换为你的 API 密钥
const DATABASE_ID = '222230cd10754cddb5745639ed429211'; // 请替换为你的数据库 ID

async function fetchNotionData() {
  const url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-05-13', // 请使用 Notion API 的最新版本
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    displayBrands(data);
  } catch (error) {
    console.error('获取 Notion 数据失败:', error);
  }
}

function displayBrands(data) {
  const brandContainer = document.getElementById('brand-container');

  data.results.forEach((brand) => {
    const brandName = brand.properties.Name.title[0].text.content;
    const brandUrl = brand.properties.URL.url;

    const brandElement = document.createElement('div');
    brandElement.classList.add('brand');

    const linkElement = document.createElement('a');
    linkElement.href = brandUrl;
    linkElement.innerText = brandName;

    brandElement.appendChild(linkElement);
    brandContainer.appendChild(brandElement);
  });
}

fetchNotionData();
