//定义 Notion API URL
const NOTION_API = "https://api.jiaju.design/v1/databases/3f12ac93b77c4250b1bddd5add895293/query";

// 定义异步函数用于获取 Notion API 数据
const fetchNotionData = async () => {
    try {
        console.log("Sending request to Notion API...");
        const response = await fetch(NOTION_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // 添加一个空的请求体
        });

        console.log("Received response from Notion API:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log("Successfully parsed JSON data");
        return data;
    } catch (error) {
        console.error("Error in fetchNotionData:", error);
        throw error;
    }
};

// 函数用于根据 Notion 数据创建 DOM 元素并返回
const createBrandElement = (item) => {
    // 创建包含品牌信息的 div 元素
    const brandElement = document.createElement('div');
    brandElement.classList.add('brand-card');

    // 创建 img 元素用于展示品牌 Logo
    const brandLogo = document.createElement('img');
    brandLogo.src = item.properties.Logo?.files[0]?.file?.url || '';
    brandLogo.width = 54;
    brandLogo.height = 54;
    brandLogo.alt = item.properties.Brand?.title[0]?.plain_text || 'Unknown';
    brandLogo.classList.add('brand-logo');
    brandElement.appendChild(brandLogo);

    // 创建 div 元素用于包含品牌详细信息
    const brandDetails = document.createElement('div');
    brandDetails.classList.add('brand-details');

    // 创建 h3 元素用于展示品牌名称
    const brandName = document.createElement('h3');
    brandName.textContent = item.properties.Brand?.title[0]?.plain_text || 'Unknown';
    brandName.classList.add('brand-name');
    brandDetails.appendChild(brandName);

    // 创建 p 元素用于展示品牌介绍
    const intro = document.createElement('p');
    intro.textContent = item.properties.Introduction?.rich_text[0]?.plain_text || 'No Introduction';
    intro.classList.add('brand-intro');
    brandDetails.appendChild(intro);

    // 添加品牌详细信息到品牌元素
    brandElement.appendChild(brandDetails);

    // 点品牌元素时，打开品牌链接
    brandElement.onclick = () => window.open(item.properties.URL?.url || '#', '_blank');
    return brandElement;
};

// 函数用于创建一个包含组标题的元素并返回
const createGroupElement = (groupTitle) => {
    const groupElement = document.createElement('div');
    groupElement.classList.add('group');
    groupElement.id = groupTitle; 

    const groupTitleElement = document.createElement('h2');
    groupTitleElement.textContent = groupTitle;
    groupElement.appendChild(groupTitleElement);

    // 创建一个新的 div 元素，用于包含所有的 brand-card 元素
    const brandsContainerElement = document.createElement('div');
    brandsContainerElement.classList.add('brands-container');  // 可以在 CSS 中添加 '.brands-container { display: grid; }'
    groupElement.appendChild(brandsContainerElement);

    // 在 groupElement 对象中存储 brandsContainerElement，以便后面使用
    groupElement.brandsContainer = brandsContainerElement;

    return groupElement;
};

// 创建导航、锚点标签变量，为后面计算高度做准备
const navbarAndTabs = document.querySelector('.navbar-and-tabs');
const tabsElement = navbarAndTabs.querySelector('.tabs');
// 存储 tabsElement 最初的顶部偏移
let originalTopOffset;
// 函数用于根据滚动位置动态调整 navbarAndTabs 的位置
function adjustNavbarAndTabsPosition() {
    const navbarAndTabsHeight = navbarAndTabs.getBoundingClientRect().height;
    if (window.scrollY >= originalTopOffset - navbarAndTabsHeight) {
        navbarAndTabs.style.position = 'fixed';
        navbarAndTabs.style.top = '0';
        navbarAndTabs.style.width = '100%';
    } else {
        navbarAndTabs.style.position = 'static';
    }
}
// 函数用于平滑滚动至指定元素
const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID ${elementId} not found.`);
        return;
    }
    const yOffset = -navbarAndTabs.getBoundingClientRect().height - 30;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });

    // 添加延迟后的位置检查
    setTimeout(() => {
        const currentPosition = element.getBoundingClientRect().top;
        if (Math.abs(currentPosition - tabsElement.getBoundingClientRect().bottom) > 5) {
            window.scrollTo({ top: window.pageYOffset + currentPosition - tabsElement.getBoundingClientRect().bottom, behavior: 'smooth' });
        }
    }, 500); // 500毫秒后检查
};

// 当页面完全加载后执行的函数
window.onload = async () => {
    try {
        console.log("Window loaded, starting data fetch...");
        const loadingElement = document.getElementById('loading');
        loadingElement.style.display = 'block';

        const data = await fetchNotionData();
        console.log("Data fetched successfully, processing...");

        // 遍历 Notion 数据，根据数据创建元素，并添加到页面
        const brandsElement = document.getElementById('brands');
        const groups = {};
        const groupsOrder = ["国外品牌", "国内品牌", "设计工匠", "资料百科"];
        data.results.sort((a, b) => {
            return groupsOrder.indexOf(a.properties.Group?.select?.name) - groupsOrder.indexOf(b.properties.Group?.select?.name);
        });
        for (const item of data.results) {
            const groupTitle = item.properties.Group?.select?.name;
            if (!groups[groupTitle]) {
                groups[groupTitle] = createGroupElement(groupTitle);
            }
            const brandElement = createBrandElement(item);
            groups[groupTitle].brandsContainer.appendChild(brandElement); 
        }
        for (const groupTitle in groups) {
            brandsElement.appendChild(groups[groupTitle]);
        }

        console.log("Data processing complete, updating UI...");
        loadingElement.style.display = 'none';
        document.querySelector('footer').style.display = 'flex';
        document.querySelector('.subscribe').style.display = 'flex';
        tabsElement.style.display = 'block';

        console.log("UI update complete");
    } catch (error) {
        console.error("Error in main function:", error);
        const loadingElement = document.getElementById('loading');
        loadingElement.style.display = 'none';

        // 显示错误信息给用户
        const errorMessage = document.createElement('p');
        errorMessage.textContent = "加载失败，请稍后再试。错误详情：" + error.message;
        errorMessage.style.color = 'red';
        errorMessage.style.padding = '20px';
        document.body.appendChild(errorMessage);
    }
    
    // 以是关于菜单互的代码
    let menuIcon = document.querySelector('.menu-icon');
    let menuOverlay = document.querySelector('.menu');
    let menuActive = false; 
    menuIcon.addEventListener('click', function () {
        if (menuActive) {
            menuOverlay.classList.remove('active');
            this.classList.remove('open');
            document.body.style.overflow = 'auto';
        } else {
            menuOverlay.classList.add('active');
            this.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        
        menuActive = !menuActive; 
    });
};