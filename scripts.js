const NOTION_API = "https://api.jiaju.design/v1/databases/3f12ac93b77c4250b1bddd5add895293/query";

const fetchNotionData = async () => {
    const response = await fetch(NOTION_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data from Notion API");
    }

    const data = await response.json();
    console.log(data.results);
    return data;
};

const createBrandElement = (item) => {
    const brandElement = document.createElement('div');
    brandElement.classList.add('brand-card');

    const brandLogo = document.createElement('img');
    brandLogo.src = item.properties.Logo?.files[0]?.file?.url || '';
    brandLogo.width = 54;
    brandLogo.height = 54;
    brandLogo.alt = item.properties.Brand?.title[0]?.plain_text || 'Unknown';
    brandLogo.classList.add('brand-logo');
    brandElement.appendChild(brandLogo);

    const brandDetails = document.createElement('div');
    brandDetails.classList.add('brand-details');

    const brandName = document.createElement('h3');
    brandName.textContent = item.properties.Brand?.title[0]?.plain_text || 'Unknown';
    brandName.classList.add('brand-name');
    brandDetails.appendChild(brandName);

    const intro = document.createElement('p');
    intro.textContent = item.properties.Introduction?.rich_text[0]?.plain_text || 'No Introduction';
    intro.classList.add('brand-intro');
    brandDetails.appendChild(intro);

    brandElement.appendChild(brandDetails);

    const groupTitle = item.properties.Group?.select?.name;

    if (groupTitle === '🌍 国外品牌') {
        brandElement.style.backgroundColor = '#F4F1E6';
    } else if (groupTitle === '🇨🇳 国内品牌') {
        brandElement.style.backgroundColor = '#F0F9FE';
    } else if (groupTitle === '🪓 设计工匠') {
        brandElement.style.backgroundColor = '#F8F0F1';
    } else if (groupTitle === '📖 资料百科') {
        brandElement.style.backgroundColor = '#F0F8F2';
    } else {
        brandElement.style.backgroundColor = '#ccc';
    }

    brandElement.onclick = () => window.open(item.properties.URL?.url || '#', '_blank');

    return brandElement;
};


window.onload = async () => {
    try {
        const loadingElement = document.getElementById('loading');
        loadingElement.style.display = 'block';
        const data = await fetchNotionData();
        const brandsElement = document.getElementById('brands');
        const groups = {};

        const groupsOrder = ["🌍 国外品牌", "🇨🇳 国内品牌", "🪓 设计工匠", "📖 资料百科"];
        data.results.sort((a, b) => {
            return groupsOrder.indexOf(a.properties.Group?.select?.name) - groupsOrder.indexOf(b.properties.Group?.select?.name);
        });

        for (const item of data.results) {
            const groupTitle = item.properties.Group?.select?.name;

            if (!groups[groupTitle]) {
                groups[groupTitle] = document.createElement('div');
                groups[groupTitle].classList.add('group');

                const groupTitleElement = document.createElement('h2');
                groupTitleElement.textContent = groupTitle;
                groups[groupTitle].appendChild(groupTitleElement);
            }

            const brandElement = createBrandElement(item);
            groups[groupTitle].appendChild(brandElement);
        }

        for (const groupTitle in groups) {
            brandsElement.appendChild(groups[groupTitle]);
        }
        loadingElement.style.display = 'none';
    } catch (error) {
        loadingElement.style.display = 'none';
        console.error("Failed to fetch brand data:", error);
    }
};
