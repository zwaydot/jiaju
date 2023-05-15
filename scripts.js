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
            if (logoFile) {
                const logo = document.createElement('img');
                logo.src = logoFile.file.url; // 将logoFile.url更改为logoFile.file.url
                brandElement.appendChild(logo);
            } else {
                console.warn('No Logo for item:', item);
            }
            
            const pictureFile = item.properties.Picture?.files[0];
            if (pictureFile) {
                const picture = document.createElement('img');
                picture.src = pictureFile.url;
                brandElement.appendChild(picture);
            } else {
                console.warn('No Picture for item:', item);
            }



            // const logo = document.createElement('img');
            // logo.src = item.properties.Logo?.files[0]?.url || 'No Logo';
            // brandElement.appendChild(logo);

            const url = document.createElement('a');
            url.href = item.properties.URL?.url || '#';
            url.textContent = "Visit website";
            brandElement.appendChild(url);

            // const picture = document.createElement('img');
            // picture.src = item.properties.Picture?.files[0]?.url || 'No Picture';
            // brandElement.appendChild(picture);

        const brandsElement = document.getElementById('brands');
        for (const group in groups) {
            brandsElement.appendChild(groups[group]);
        }
    } catch (error) {
        console.error("Failed to fetch brand data:", error);
    }
};
