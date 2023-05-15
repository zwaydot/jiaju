const NOTION_API = "https://crimson-shape-242d.zwaydot4972.workers.dev/v1/databases/3f12ac93b77c4250b1bddd5add895293/query";

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

    // 在这里插入console.log(data.results);
    console.log(data.results);

    return data;
};

window.onload = async () => {
    try {
        const data = await fetchNotionData();
        const brandsContainer = document.getElementById('brands-container');

        const groupElements = {}; // 存储不同分组的元素

        for (const item of data.results) {
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

            const brandGroup = item.properties.Group?.select?.name;
            if (brandGroup) {
                if (!groupElements[brandGroup]) { // 如果这个分组的元素还没有创建
                    // 创建一个新的元素来展示这个分组
                    const groupElement = document.createElement('div');
                    groupElement.id = brandGroup;
                    groupElement.classList.add('brand-group');

                    const groupTitle = document.createElement('h1');
                    groupTitle.textContent = brandGroup;
                    groupElement.appendChild(groupTitle);

                    groupElements[brandGroup] = groupElement;
                    brandsContainer.appendChild(groupElement);
                }

                // 将品牌添加到对应的分组中
                groupElements[brandGroup].appendChild(brandElement);
            } else {
                console.warn('No Group for item:', item);
            }
        }
    } catch (error) {
        console.error("Failed to fetch brand data:", error);
    }
};
