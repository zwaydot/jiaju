//定义 Notion API URL
const NOTION_API = "https://api.jiaju.design/v1/databases/3f12ac93b77c4250b1bddd5add895293/query";

// 定义异步函数用于获取 Notion API 数据
const fetchNotionData = async () => {
    // 使用 fetch API 发送 POST 请求到 Notion API
    const response = await fetch(NOTION_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // 检查响应是否成功，否则抛出错误
    if (!response.ok) {
        throw new Error("Failed to fetch data from Notion API");
    }

    // 将响应的 JSON 数据转换成 JavaScript 对象并返回
    return await response.json();
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

    // 点击品牌元素时，打开品牌链接
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
    // 添加一个点击状态变量
    const scrollTriggeredByClick = false;  
    // 获取所有的标签元素，为每个标签元素添加点击事件监听器
    const tabs = tabsElement.querySelectorAll('button');
    const firstTab = tabs[0];

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            scrollToElement(tab.textContent);
        });
    });

    // 默认选中第一个tab
    if (firstTab) {
        firstTab.classList.add('selected');
    }

    // 页面加载完成后，计算 originalTopOffset 值并调整 navbarAndTabs 位置
    setTimeout(() => {
        originalTopOffset = navbarAndTabs.getBoundingClientRect().top + window.scrollY;
        adjustNavbarAndTabsPosition();
    }, 500);

    // 添加滚动事件监听器
    window.addEventListener('scroll', () => {
        // 调整 navbarAndTabs 的位置
        adjustNavbarAndTabsPosition();
        // 调整 navbarAndTabs 的背景透明度
        let scrollY = window.scrollY;
        if(scrollY <= 100){
            let opacity = scrollY / 100 * 0.5;
            navbarAndTabs.style.backgroundColor = `rgba(246, 246, 246, ${opacity})`;
        } else {
            navbarAndTabs.style.backgroundColor = 'rgba(246, 246, 246, 0.8)';
        }
        // 检查每个品牌分组元素的位置，如果其上边缘已经滚动到 tabs 元素的下边缘以下，则将对应的标签元素设为选中状态
        for (const tab of tabs) {
            const groupElement = document.getElementById(tab.textContent);
            if (groupElement) {
                const groupRect = groupElement.getBoundingClientRect();
                const tabsRect = tabsElement.getBoundingClientRect();
                if (groupRect.top <= tabsRect.bottom + 20) { // 增加容差值
                    // 移除所有标签元素的选中状态
                    for (const otherTab of tabs) {
                        otherTab.classList.remove('selected');
                    }
                    // 设置当前标签元素为选中状态
                    tab.classList.add('selected');
                }
            }
        }
    });

    // 以下部分处理 Notion 数据的获取和处理
    try {
        // 显示加载动画
        const loadingElement = document.getElementById('loading');
        loadingElement.style.display = 'block';

        // 获取 Notion 数据
        const data = await fetchNotionData();

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

        // 隐藏加载动画
        loadingElement.style.display = 'none';

        // 显示底部信息和标签元素
        document.querySelector('footer').style.display = 'flex';
        document.querySelector('.subscribe').style.display = 'flex';
        tabsElement.style.display = 'block';
    } 
    catch (error) {
        // 如果在获取或处理数据时发生错误，隐藏加载动画并打印错误信息
        loadingElement.style.display = 'none';
        console.error("Failed to fetch brand data:", error);
    }
    
    // 以���是关于菜单交互的代码
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