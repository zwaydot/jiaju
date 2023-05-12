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
            brandName.textContent = item.properties.Brand.title[0].plain_text;  
            brandElement.appendChild(brandName);
            
            const intro = document.createElement('p');
            intro.textContent = item.properties.Introduction.rich_text[0].plain_text;
            brandElement.appendChild(intro);

            const logo = document.createElement('img');
            logo.src = item.properties.Logo.url;
            brandElement.appendChild(logo);

            const url = document.createElement('a');
            url.href = item.properties.URL.url;
            url.textContent = "Visit website";
            brandElement.appendChild(url);
            
            const picture = document.createElement('img');
            picture.src = item.properties.Picture.url;
            brandElement.appendChild(picture);

            brandsElement.appendChild(brandElement);
        }
    } catch (error) {
        console.error("Failed to fetch brand data:", error);
    }
};
