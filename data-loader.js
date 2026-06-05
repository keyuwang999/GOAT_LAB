/* 
   DATA LOADER SYSTEM
   功能：读取 data/ 文件夹下的 JSON 数据，自动渲染网页内容。
*/

document.addEventListener('DOMContentLoaded', function () {
    // 1. 所有页面都加载的部分
    loadNavbar();
    loadFooter();

    // 2. 根据当前页面 ID，加载特定内容
    // (请确保 HTML body 或特定容器有对应的 ID，或者直接判断容器是否存在)

    if (document.getElementById('people-container')) {
        loadPeople();
    }

    if (document.getElementById('publications-container')) {
        loadPublications();
    }

    if (document.getElementById('featured-container')) {
        loadFeaturedPublications(); // 首页或 Research 页的精选论文
    }

    if (document.getElementById('news-feed')) {
        loadNews();
    }

    if (document.getElementById('inventory-grid')) {
        loadInventory();
    }
});

/* =========================================
   1. 导航栏加载器 (Navbar Loader)
   ========================================= */
function loadNavbar() {
    fetch('data/navbar.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('nav-menu-container');
            if (!container) return;

            // 获取当前页面文件名，用于高亮 Active 状态
            const currentPage = window.location.pathname.split("/").pop() || "index.html";

            let html = '';
            data.forEach(item => {
                const isActive = item.link === currentPage ? 'active' : '';

                if (item.highlight) {
                    // 特殊按钮 (如 Join Us)
                    html += `
                        <li class="nav-item ms-lg-2">
                            <a class="btn btn-seu-green btn-sm px-3 rounded-pill ${isActive}" href="${item.link}">${item.name}</a>
                        </li>
                    `;
                } else {
                    // 普通链接
                    html += `
                        <li class="nav-item">
                            <a class="nav-link ${isActive}" href="${item.link}">${item.name}</a>
                        </li>
                    `;
                }
            });
            container.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
            const container = document.getElementById('nav-menu-container');
            if (container) {
                // 如果导航加载失败，在右上角显示一个红色的错误提示
                container.innerHTML = `
                    <li class="nav-item">
                        <span class="nav-link text-danger fw-bold"><i class="fas fa-exclamation-circle me-1"></i>Menu Load Error</span>
                    </li>
                `;
            }
        });
}

/* =========================================
   2. 页脚加载器 (Footer Loader)
   ========================================= */
function loadFooter() {
    const container = document.getElementById('global-footer');
    if (!container) return;

    // 这里放统一的页脚 HTML
    container.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-lg-4 mb-4 mb-lg-0">
                    <h4 class="mb-4">GOAT LAB</h4>
                    <p class="small opacity-75">
                        School of Integrated Circuits<br>
                        Southeast University (Wuxi Campus)
                    </p>
                    <p class="small opacity-75">
                        <i class="fas fa-map-marker-alt me-2"></i> No. 99, Linghu Avenue, Xinwu District, Wuxi, Jiangsu, China
                    </p>
                </div>
                <div class="col-lg-4 mb-4 mb-lg-0">
                    <h5 class="mb-3">Quick Links</h5>
                    <ul class="list-unstyled small opacity-75">
                        <li><a href="research.html" class="text-white text-decoration-none">Research</a></li>
                        <li><a href="publications.html" class="text-white text-decoration-none">Publications</a></li>
                        <li><a href="join.html" class="text-white text-decoration-none">Join Us</a></li>
                        <li><a href="https://www.seu.edu.cn" target="_blank" class="text-white text-decoration-none">Southeast University</a></li>
                    </ul>
                </div>
                <div class="col-lg-4">
                    <h5 class="mb-3">Contact</h5>
                    <ul class="list-unstyled small opacity-75">
                        <li class="mb-2"><i class="fas fa-envelope me-2"></i>qiubozhang@seu.edu.cn</li>
                    </ul>
                </div>
            </div>
            <div class="border-top border-secondary mt-4 pt-4 text-center small opacity-50">
                &copy; ${new Date().getFullYear()} GOAT LAB. All Rights Reserved.
            </div>
        </div>
    `;
}

/* =========================================
   3. 人员列表加载器 (People Loader)
   ========================================= */
function loadPeople() {
    fetch('data/people.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('people-container');
            if (!container) return;

            let html = '';

            // 过滤出学生 (这里假设 PI 单独处理，或者如果 json 里也有 PI，可以通过 type 过滤)
            // 这里我们展示所有 type 不为 'pi' 的成员，或者您可以根据 json 结构调整
            const students = data.filter(person => person.type !== 'pi');

            students.forEach((person, index) => {
                // 生成教育经历列表
                let eduHtml = '';
                if (person.education && Array.isArray(person.education)) {
                    eduHtml = `<ul class="list-unstyled edu-list mb-3">`;
                    person.education.forEach(edu => {
                        eduHtml += `<li class="mb-1">${edu}</li>`;
                    });
                    eduHtml += `</ul>`;
                }

                // 生成 HTML (保持您原来的 List 样式)
                html += `
                <div class="profile-row d-flex flex-column flex-md-row align-items-start py-4 border-bottom" data-aos="fade-up" data-aos-delay="${index * 50}">
                    <div class="mb-3 mb-md-0 me-md-4 flex-shrink-0">
                        <a href="${person.image}" class="glightbox">
                            <img src="${person.image}" alt="${person.name}" class="member-img-rect rounded shadow-sm" onerror="this.onerror=null;this.src='images/placeholder_user.png'">
                        </a>
                    </div>
                    <div class="flex-grow-1">
                        <h3 class="profile-name mb-1">${person.name} ${person.chineseName ? `(${person.chineseName})` : ''}, ${person.title}</h3>
                        <p class="fw-bold mb-3" style="color: #212529;">${person.period || 'Graduate Student'}</p>
                        
                        ${eduHtml}

                        <div class="d-flex align-items-center text-dark">
                            <span class="fw-bold me-2">Email:</span>
                            <a href="mailto:${person.email}" class="text-decoration-none" style="color: #4da6ba;">${person.email}</a>
                        </div>
                    </div>
                </div>
                `;
            });

            container.innerHTML = html;

            // 重新初始化 AOS 动画和 GLightbox
            if (typeof AOS !== 'undefined') AOS.refresh();
            if (typeof GLightbox !== 'undefined') GLightbox({ selector: '.glightbox' });
        })
        .catch(error => {
            // 拦截到错误，执行这里的“备用方案”
            console.error('获取人员数据失败:', error);

            const container = document.getElementById('people-container');
            if (container) {
                // 用友好的提示替换掉原本的 Loading 文字
                container.innerHTML = `
                    <div class="text-center py-5 text-danger opacity-75">
                        <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                        <h5>Sorry, data failed to load.</h5>
                        <p class="text-muted small">Please refresh the page or try again later.</p>
                    </div>
                `;
            }
        });
}

/* =========================================
   4. 论文列表加载器 (Publications Loader)
   ========================================= */
function loadPublications() {
    fetch('data/publications.json')
        .then(response => response.json())
        .then(data => {
            const listContainer = document.getElementById('publications-container');
            const navContainer = document.getElementById('year-nav-container'); // 侧边栏
            if (!listContainer) return;

            // --- 修改核心开始：分组逻辑 ---
            const grouped = {};
            const cutoff = 2018; // 设置分界线年份
            const priorLabel = "Prior to 2018"; // 设置显示的标题

            data.forEach(pub => {
                // 确保年份是数字类型，防止json里写成字符串
                const y = parseInt(pub.year);

                if (y < cutoff) {
                    // 如果年份小于 2018，放入 "Prior to 2018" 组
                    if (!grouped[priorLabel]) grouped[priorLabel] = [];
                    grouped[priorLabel].push(pub);
                } else {
                    // 如果年份 >= 2018，按具体年份分组
                    if (!grouped[y]) grouped[y] = [];
                    grouped[y].push(pub);
                }
            });

            // 额外步骤：对 "Prior to 2018" 组内部的文章进行倒序排列（比如 2017 排在 2016 前面）
            if (grouped[priorLabel]) {
                grouped[priorLabel].sort((a, b) => b.year - a.year);
            }

            // 排序键名：数字年份倒序 (2025 -> 2018)，最后放字符串 (Prior to 2018)
            const sortedKeys = Object.keys(grouped).sort((a, b) => {
                if (a === priorLabel) return 1; // Prior 放最后
                if (b === priorLabel) return -1;
                return b - a; // 数字年份倒序
            });
            // --- 修改核心结束 ---

            let listHtml = '';
            let navHtml = '';

            sortedKeys.forEach((key, index) => {
                // 生成安全的 ID：
                // 如果是 2025，ID 为 year-2025
                // 如果是 Prior to 2018，ID 为 year-prior (去除空格，防止链接失效)
                const safeId = (key === priorLabel) ? 'year-prior' : `year-${key}`;

                // 1. 生成侧边栏导航
                // index === 0 表示第一个年份（如2025）默认高亮
                navHtml += `<a class="nav-link text-dark mb-1 ${index === 0 ? 'active' : ''}" href="#${safeId}">${key}</a>`;

                // 2. 生成主列表
                listHtml += `<div id="${safeId}" class="year-section mb-5" data-aos="fade-up">`;
                listHtml += `<h4 class="mb-3 text-seu-green border-bottom pb-2">${key}</h4>`; // 这里显示 2025 或 Prior to 2018
                listHtml += `<ul class="list-unstyled pub-list">`;

                grouped[key].forEach(pub => {
                    listHtml += `
                        <li class="mb-4">
                            <div class="d-flex align-items-start">
                                <span class="pub-number text-muted me-3"></span>
                                <div>
                                    <h5 class="h6 fw-bold mb-1">${pub.title}</h5>
                                    <p class="text-muted small mb-1">
                                        ${pub.authors}
                                        <br>
                                        <span class="journal-name fw-bold text-dark">${pub.journal}</span>, ${pub.year}.
                                    </p>
                                    <div class="mt-2">
                                        ${pub.doi ? `<a href="${pub.doi}" target="_blank" class="btn btn-sm btn-outline-dark rounded-0 py-0 px-2 me-2" style="font-size:12px;">DOI</a>` : ''}
                                        ${pub.pdf ? `<a href="${pub.pdf}" target="_blank" class="btn btn-sm btn-outline-danger rounded-0 py-0 px-2" style="font-size:12px;">PDF</a>` : ''}
                                    </div>
                                </div>
                            </div>
                        </li>
                    `;
                });

                listHtml += `</ul></div>`;
            });

            listContainer.innerHTML = listHtml;
            if (navContainer) navContainer.innerHTML = navHtml;

            // 刷新动画
            if (typeof AOS !== 'undefined') AOS.refresh();

            // 刷新移动端下拉框 (如果有)
            const mobileSelect = document.getElementById('mobileYearSelect');
            if (mobileSelect) {
                let opts = '<option selected disabled>Jump to Year</option>';
                sortedKeys.forEach(k => {
                    const safeId = (k === priorLabel) ? 'year-prior' : `year-${k}`;
                    opts += `<option value="#${safeId}">${k}</option>`;
                });
                mobileSelect.innerHTML = opts;
            }
        })
        .catch(error => {
            console.error('获取论文数据失败:', error);
            const listContainer = document.getElementById('publications-container');
            if (listContainer) {
                listContainer.innerHTML = `
                    <div class="text-center py-5 text-danger opacity-75">
                        <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                        <h5>Sorry, publications failed to load.</h5>
                        <p class="text-muted small">Please refresh the page or try again later.</p>
                    </div>
                `;
            }
        });
}

// 辅助：填充 Research/首页 的精选论文
function loadFeaturedPublications() {
    fetch('data/publications.json')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('featured-container');
            if (!container) return;

            // 筛选 highlight = true 的文章
            const featured = data.filter(p => p.highlight === true);

            let html = '';
            featured.forEach(pub => {
                html += `
                <div class="card border-0 shadow-lg overflow-hidden mb-4" data-aos="fade-up">
                    <div class="card-body p-4">
                        <div class="text-muted small mb-2 font-monospace">${pub.year} · ${pub.journal}</div>
                        <h3 class="card-title font-serif fw-bold mb-3 h5">
                            <a href="${pub.doi || '#'}" target="_blank" class="text-dark-blue text-decoration-none hover-green">${pub.title}</a>
                        </h3>
                        <p class="card-text text-muted mb-3 small">
                            ${pub.authors}
                        </p>
                        <div class="d-flex gap-2">
                            ${pub.doi ? `<a href="${pub.doi}" target="_blank" class="btn btn-outline-dark btn-sm rounded-0">DOI</a>` : ''}
                            ${pub.pdf ? `<a href="${pub.pdf}" target="_blank" class="btn btn-outline-danger btn-sm rounded-0">PDF</a>` : ''}
                        </div>
                    </div>
                </div>
                `;
            });
            container.innerHTML = html;
        })
        .catch(error => {
            console.error('获取精选论文失败:', error);
            const container = document.getElementById('featured-container');
            if (container) {
                // 主页使用相对小巧的提示框
                container.innerHTML = `
                    <div class="alert alert-danger text-center border-0 opacity-75" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i> Failed to load featured publications.
                    </div>
                `;
            }
        });
}

// 辅助：初始化移动端年份下拉框
function initMobileYearSelect(years) {
    const select = document.getElementById('mobileYearSelect');
    if (!select) return;
    let html = '<option selected disabled>Jump to Year</option>';
    years.forEach(y => {
        html += `<option value="#year-${y}">${y}</option>`;
    });
    select.innerHTML = html;
}


/* =========================================
   5. 新闻列表加载器 (News Loader) - 修复计数与筛选
   ========================================= */
function loadNews() {
    fetch('data/news.json')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('news-feed');
            if (!container) return;

            // 1. 渲染新闻列表
            let html = '';
            data.forEach((item) => {
                html += `
                <div class="card border-0 shadow-sm mb-5 news-card news-item" data-category="${item.category}" data-aos="fade-up">
                    <div class="row g-0">
                        <div class="col-md-4 position-relative">
                            <img src="${item.image}" class="img-fluid h-100 object-fit-cover rounded-start" alt="News Image" onerror="this.onerror=null;this.src='images/placeholder_news.jpg'">
                            <div class="date-badge-overlay">
                                <span class="day">${item.day}</span>
                                <span class="month">${item.month}</span>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="card-body p-4">
                                <div class="mb-2">
                                    <span class="badge bg-light text-seu-green border border-success">${item.badge || 'News'}</span>
                                </div>
                                <h3 class="h4 card-title font-serif fw-bold text-clamp-2">
                                    <a href="#" class="text-dark text-decoration-none hover-green" onclick="return false;">${item.title}</a>
                                </h3>
                                <p class="card-text text-muted small mt-3 text-clamp-2">
                                    ${item.summary}
                                </p>
                                <a href="#" class="text-seu-green small fw-bold text-decoration-none"
                                   onclick="openNewsModal(this, '${item.title.replace(/'/g, "\\'")}', '${item.date}', '${item.badge}', '${item.content.replace(/'/g, "\\'")}', '${item.image}')">
                                    Read More <i class="fas fa-arrow-right ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            });

            // 补充 Pagination 和 No Result 容器
            html += `
            <div id="noNewsMsg" class="text-center py-5" style="display: none;">
                <p class="text-muted">No news found matching your criteria.</p>
                <button class="btn btn-sm btn-outline-secondary" onclick="document.getElementById('newsSearchInput').value=''; runNewsFilter('', 'all');">Clear Search</button>
            </div>
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-center" id="pagination-container"></ul>
            </nav>
            `;

            container.innerHTML = html;

            // 2. 自动统计分类数量并更新侧边栏 (关键修复)
            updateSidebarCounts(data);

            // 3. 重新初始化筛选逻辑 (解决 No news found 问题)
            // 因为数据是刚加载出来的，我们需要手动触发一次初始化
            if (typeof initNewsSystem === 'function') {
                initNewsSystem(); // 重新读取 DOM 元素
            }

            if (typeof AOS !== 'undefined') AOS.refresh();
        })
        .catch(error => {
            console.error('获取新闻数据失败:', error);
            const container = document.getElementById('news-feed');
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-5 text-danger opacity-75">
                        <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                        <h5>Sorry, news failed to load.</h5>
                        <p class="text-muted small">Please refresh the page or try again later.</p>
                    </div>
                `;
            }
        });
}

// 新增辅助函数：更新侧边栏计数
function updateSidebarCounts(data) {
    let counts = {
        all: data.length,
        publication: 0,
        academic: 0,
        community: 0
    };

    data.forEach(item => {
        const cats = item.category.toLowerCase();
        // 只要 json 里的 category 包含这个词，就算在内
        if (cats.includes('publication')) counts.publication++;
        if (cats.includes('academic') || cats.includes('conference')) counts.academic++;
        if (cats.includes('community') || cats.includes('life') || cats.includes('award')) counts.community++;
    });

    const updateBadge = (filterKey, count) => {
        const link = document.querySelector(`.category-filter[data-filter="${filterKey}"]`);
        if (link) {
            const badge = link.querySelector('.count-badge');
            if (badge) badge.innerText = count;
        }
    };

    updateBadge('all', counts.all);
    updateBadge('publication', counts.publication);
    updateBadge('academic', counts.academic);
    updateBadge('community', counts.community);
}

/* =========================================
   6. 资产清单加载器 (对接维格表后台)
   ========================================= */
function loadInventory() {
    // 【注意：你需要修改下面这两行】
    const DATASHEET_ID = 'dstl1RyX7VKqrWydsW'; // 替换为你的表格 ID
    const API_TOKEN = 'uskVaWW1ukPpUubP6PHCHqP';    // 替换为你的 API Token

    // 维格表的接口地址
    const API_URL = `https://api.vika.cn/fusion/v1/datasheets/${DATASHEET_ID}/records`;

    // 带着 Token 发起请求，而不是去读本地的 json 文件
    fetch(API_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`
        }
    })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(responseJson => {
            const container = document.getElementById('inventory-grid');
            if (!container) return;

            // 【关键改变】：解析维格表嵌套的数据结构，提取出有用的字段
            const data = responseJson.data.records.map(record => record.fields);

            // 渲染网格视图
            const renderGrid = (filterText, filterCategory) => {
                let html = '';
                let count = 0;

                data.forEach(item => {
                    // 1. 基础数据读取
                    const id = item.id || 'N/A';
                    const name = item.name || '未命名';
                    const status = item.status || 'normal';

                    // 2. 安全读取 Category (分类单选项)
                    let categoryStr = '其他';
                    if (typeof item.category === 'string') {
                        categoryStr = item.category;
                    } else if (item.category && item.category.name) {
                        categoryStr = item.category.name;
                    }

                    // 3. 【新增】安全读取 Owner (负责人单选项)
                    let ownerStr = '待分配';
                    if (typeof item.owner === 'string') {
                        ownerStr = item.owner;
                    } else if (item.owner && item.owner.name) {
                        ownerStr = item.owner.name;
                    } else if (Array.isArray(item.owner)) {
                        // 顺手做一个兼容：如果以后你把负责人改成了“多选”，网页也能正常显示两个人名
                        ownerStr = item.owner.map(o => typeof o === 'string' ? o : o.name).join(', ');
                    }

                    // 4. 中英文分类字典映射
                    const categoryMap = {
                        'equipment': '仪器设备',
                        'material': '实验耗材',
                        'tool': '工具配件'
                    };
                    const targetChineseCat = categoryMap[filterCategory];

                    // 5. 【修复】强大的搜索匹配逻辑 (现在把 ownerStr 也加进来了)
                    const filterTextLower = filterText.toLowerCase();
                    const matchText = name.toLowerCase().includes(filterTextLower) ||
                        id.toLowerCase().includes(filterTextLower) ||
                        ownerStr.toLowerCase().includes(filterTextLower); // 支持搜人名！

                    const matchCat = filterCategory === 'all' || categoryStr === targetChineseCat;

                    if (!(matchText && matchCat)) return;
                    count++;

                    // 6. 极简状态指示灯逻辑
                    let statusArray = [];
                    if (Array.isArray(item.status)) {
                        statusArray = item.status;
                    } else if (item.status) {
                        statusArray = [item.status];
                    } else {
                        statusArray = ['正常闲置'];
                    }

                    let statusBadge = '';
                    statusArray.forEach(tag => {
                        let badgeClass = 'bg-secondary text-secondary border-secondary';
                        let icon = 'fa-info-circle';

                        if (tag.includes('正常') || tag.includes('闲置')) {
                            badgeClass = 'bg-success text-success border-success';
                            icon = 'fa-check-circle';
                        } else if (tag.includes('使用') || tag.includes('借') || tag.includes('占')) {
                            badgeClass = 'bg-warning text-warning border-warning';
                            icon = 'fa-hand-holding';
                        } else if (tag.includes('修') || tag.includes('异常') || tag.includes('坏') || tag.includes('废')) {
                            badgeClass = 'bg-danger text-danger border-danger';
                            icon = 'fa-tools';
                        } else if (tag.includes('急') || tag.includes('缺') || tag.includes('尽')) {
                            badgeClass = 'bg-danger text-danger border-danger';
                            icon = 'fa-exclamation-triangle';
                        }

                        statusBadge += `<span class="badge ${badgeClass} bg-opacity-10 border ms-1 mb-1"><i class="fas ${icon} me-1"></i> ${tag}</span>`;
                    });

                    // 7. 生成卡片 HTML (注意底部负责人使用了转换后的 ownerStr)
                    html += `
                    <div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up">
                        <div class="card h-100 border-0 shadow-sm hover-card overflow-hidden">
                            <div class="bg-light p-2" style="height: 180px;">
                                <a href="${item.image || 'images/placeholder_news.jpg'}" class="glightbox" data-title="${name}">
                                    <img src="${item.image || 'images/placeholder_news.jpg'}" class="w-100 h-100 object-fit-contain" style="cursor: zoom-in;" alt="${name}" onerror="this.onerror=null; this.src='images/placeholder_news.jpg'">
                                </a>
                        </div>
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <span class="text-muted small font-monospace">${id}</span>
                                ${statusBadge}
                            </div>
                            <h4 class="h5 font-serif fw-bold text-dark-blue mb-2">${name}</h4>
                            <p class="text-muted small mb-3 text-clamp-2">${item.desc || '暂无描述'}</p>
                            <hr class="opacity-10">
                            <div class="d-flex justify-content-between small">
                                <span class="text-muted"><i class="fas fa-map-marker-alt text-seu-green me-1"></i> ${item.location || '未知'}</span>
                                <span class="text-muted"><i class="fas fa-user text-seu-green me-1"></i> ${ownerStr}</span>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                });

                if (count === 0) {
                    html = `<div class="col-12 text-center py-5 text-muted"><i class="fas fa-box-open fa-3x mb-3 opacity-25"></i><p>未找到符合条件的资产。</p></div>`;
                }
                container.innerHTML = html;
                if (typeof AOS !== 'undefined') AOS.refresh();
                if(typeof GLightbox !== 'undefined') GLightbox({ selector: '.glightbox' });
            };

            // 初始化渲染
            renderGrid('', 'all');

            // 绑定搜索功能
            const searchInput = document.getElementById('inventorySearch');
            let searchTimeout;
            if (searchInput) {
                searchInput.addEventListener('keyup', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        const currentCat = document.querySelector('.inv-filter-btn.active').getAttribute('data-filter');
                        renderGrid(e.target.value.toLowerCase(), currentCat);
                    }, 300);
                });
            }

            // 绑定分类筛选按钮
            const filterBtns = document.querySelectorAll('.inv-filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    filterBtns.forEach(b => b.classList.remove('active', 'bg-seu-green', 'text-white'));
                    btn.classList.add('active', 'bg-seu-green', 'text-white');

                    const term = searchInput ? searchInput.value.toLowerCase() : '';
                    renderGrid(term, btn.getAttribute('data-filter'));
                });
            });
        })
        .catch(error => {
            console.error('获取资产数据失败:', error);
            const container = document.getElementById('inventory-grid');
            if (container) {
                container.innerHTML = `
                <div class="col-12 text-center py-5 text-danger opacity-75">
                    <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                    <h5>资产数据加载失败。</h5>
                    <p class="text-muted small">请检查网络或维格表接口设置。</p>
                </div>`;
            }
        });
}