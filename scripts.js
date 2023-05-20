const NOTION_API = "https://jiaju.zwaydot4972.workers.dev/v1/databases/3f12ac93b77c4250b1bddd5add895293/query";

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

    const brandName = document.createElement('h2');
    brandName.textContent = item.properties.Brand?.title[0]?.plain_text || 'Unknown';
    brandElement.appendChild(brandName);

    const intro = document.createElement('p');
    intro.textContent = item.properties.Introduction?.rich_text[0]?.plain_text || 'No Introduction';
    brandElement.appendChild(intro);

    const logoFile = item.properties.Logo?.files[0];
    if (logoFile && logoFile.file) {
        const logo = document.createElement('img');
        logo.src = logoFile.file.url; 
        brandElement.appendChild(logo);
    } else {
        console.warn('No Logo for item:', item);
    }

    const pictureFile = item.properties.Picture?.files[0];
    if (pictureFile && pictureFile.file) {
        const picture = document.createElement('img');
        picture.src = pictureFile.file.url;
        brandElement.appendChild(picture);
    } else {
        console.warn('No Picture for item:', item);
    }

    const url = document.createElement('a');
    url.href = item.properties.URL?.url || '#';
    url.textContent = "Visit website";
    brandElement.appendChild(url);

    return brandElement;
}

window.onload = async () => {
    try {
        const loadingElement = document.getElementById('loading');
        loadingElement.style.display = 'block';
        const data = await fetchNotionData();
        const brandsElement = document.getElementById('brands');
        const groups = {};

        const groupsOrder = ["国外品牌", "国内品牌", "设计工匠", "资料百科"];
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
