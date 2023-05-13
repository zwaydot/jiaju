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
    return await response.json();
};

window.onload = async () => {
    try {
        const data = await fetchNotionData();
        const brandsElement = document.getElementById('brands');
        for (const item of data.results) {
            const brandElement = document.createElement('div');
            brandElement.classList.add('brand-card');

            const brandName = document.createElement('h2');
            brandName.textContent = item.properties.Brand?.title[0]?.plain_text || 'Unknown';
            brandElement.appendChild(brandName);

            const intro = document.createElement('p');
            intro.textContent = item.properties.Introduction?.rich_text[0]?.plain_text || 'No Introduction';
            brandElement.appendChild(intro);


            const logo = document.createElement('img');
            logo.src = item.properties.Logo?.url || 'No Logo';
            brandElement.appendChild(logo);

            // const logo = document.createElement('img');
            // if (item.properties.Logo && item.properties.Logo.files && item.properties.Logo.files.length > 0) {
            //     logo.src = item.properties.Logo.files[0].url;
            // } else {
            //     logo.src = 'https://scontent-xsp1-3.cdninstagram.com/v/t51.2885-19/20590116_694938284040669_1940382356506411008_a.jpg?stp=dst-jpg_s320x320&_nc_ht=scontent-xsp1-3.cdninstagram.com&_nc_cat=109&_nc_ohc=t5YVPtl73q8AX8CicZd&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfAOdmFRuRXTUeQv1lVOMgyTkvjwAplp-zNt3Yb_Tzii5g&oe=64650251&_nc_sid=8fd12b';  // 请替换为你的默认Logo URL
            // }
            // brandElement.appendChild(logo);


            const url = document.createElement('a');
            url.href = item.properties.URL?.url || '#';
            url.textContent = "Visit website";
            brandElement.appendChild(url);

            const picture = document.createElement('img');
            picture.src = item.properties.Picture?.url || 'No Picture';
            brandElement.appendChild(picture);

            brandsElement.appendChild(brandElement);
        }
    } catch (error) {
        console.error("Failed to fetch brand data:", error);
    }
};
