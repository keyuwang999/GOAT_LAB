/* 
   THE ZHANG GROUP - CORE JAVASCRIPT
   Version: 4.0 (Final Optimized)
   Includes: Particles, Smart Scroll, News System, Gallery, Search
*/

// =========================================
// 全局变量 (News State Management)
// =========================================
const newsState = {
    itemsPerPage: 5,
    currentPage: 1,
    visibleItems: [], // 当前筛选后的数据副本
    allItems: []      // 所有原始数据缓存
};

// =========================================
// 主程序入口 (DOM Loaded)
// =========================================
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. 基础插件与UI初始化 ---
    initPlugins();
    initNavbarEffect();
    initPreloader();
    initBackToTop();
    initImageProtection();

    // --- 2. 核心功能：智能滚动 (解决被挡住问题) ---
    initSmartScroll();

    // --- 3. 首页：粒子特效 ---
    initHeroParticles();

    // --- 4. 论文页：搜索与吸顶 ---
    initPublicationFeatures();

    // --- 6. 相册页：GLightbox 与 动画过滤 ---
    initGalleryFeatures();

});


// =========================================
// 模块化函数定义 (Module Functions)
// =========================================

// 1. 基础插件 (AOS & GLightbox)
function initPlugins() {
    // 动画初始化
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'ease-out', once: true, offset: 60 });
    }
    // 灯箱初始化 (针对相册)
    if (typeof GLightbox !== 'undefined' && document.querySelector('.glightbox')) {
        const lightbox = GLightbox({ 
            touchNavigation: true, loop: true, selector: '.glightbox' 
        });
    }
}

// 2. 导航栏滚动阴影
function initNavbarEffect() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('shadow-sm');
        else navbar.classList.remove('shadow-sm');
    });
}

// 3. 预加载动画 (Preloader)
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    const removeLoader = () => setTimeout(() => preloader.classList.add('fade-out'), 300);
    window.addEventListener('load', removeLoader);
    setTimeout(removeLoader, 3000); // 3秒超时强制关闭
}

// 4. 回到顶部按钮
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) btn.classList.add('show');
        else btn.classList.remove('show');
    });
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 5. 图片防崩坏 (Image Fallback)
function initImageProtection() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            // 【修复核心 1】：如果原本就没有 src，直接跳过，不触发防崩坏
            if (!this.getAttribute('src') || this.getAttribute('src') === '') return;

            if (this.classList.contains('img-fluid')) {
                this.style.display = 'none';
                
                // 防止重复生成占位符
                if (this.previousElementSibling && this.previousElementSibling.classList.contains('image-fallback-placeholder')) return;

                const placeholder = document.createElement('div');
                // 加入 image-fallback-placeholder 用于精准识别
                placeholder.className = 'bg-light text-muted d-flex align-items-center justify-content-center image-fallback-placeholder';
                placeholder.style.cssText = 'height: 200px; width: 100%; border-radius: inherit; margin-bottom: 1rem;';
                placeholder.innerHTML = '<i class="fas fa-image fa-2x opacity-25"></i>';
                if(this.parentNode) this.parentNode.insertBefore(placeholder, this);
            }
        });
    });
}

// 6. 智能滚动逻辑 (Smart Scroll) - 核心修复
function initSmartScroll() {
    // 接管所有 # 链接
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // 过滤：忽略 News 分页按钮、无效链接、以及 Bootstrap 专属控制链接
            if (targetId === '#' || targetId === '' || 
                this.classList.contains('page-link') || 
                this.hasAttribute('data-bs-toggle')) return; // 【重点：增加这一行】
            
            // 阻止默认跳转，使用精确计算
            e.preventDefault();
            performSmartScroll(targetId);
            
            // 移动端：如果是导航栏链接，点击后自动收起菜单
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });

    // 接管手机端下拉框 (Publications)
    const mobileSelect = document.getElementById('mobileYearSelect');
    if (mobileSelect) {
        mobileSelect.addEventListener('change', function () {
            performSmartScroll(this.value);
        });
    }
}

// 辅助：执行滚动
function performSmartScroll(targetId) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    // 计算偏移量：根据设备宽度判断是否需要避开“吸顶搜索框”
    const width = window.innerWidth;
    // 手机端留 240px (导航+搜索框+间隙)，电脑端留 140px
    const offset = width < 992 ? 240 : 140; 

    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
}

// 7. 首页粒子特效
function initHeroParticles() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const container = document.createElement('div');
    container.className = 'hero-particles';
    hero.appendChild(container);

    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 12 + 4; // 随机大小
        p.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 12 + 8}s;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(p);
    }
}

// 8. 论文页逻辑 (Search & Mobile Sticky)
function initPublicationFeatures() {
    // 搜索
    const searchInput = document.getElementById('paperSearch');
    if (searchInput) {
        let paperSearchTimeout; // 【新增】：准备一个变量来存定时器

        searchInput.addEventListener('keyup', function () {
            clearTimeout(paperSearchTimeout); // 【新增】：只要敲了键盘，就打断之前的倒计时

            // 【新增】：设置一个新的 300 毫秒倒计时，把原本的搜索逻辑包在里面
            paperSearchTimeout = setTimeout(() => {
                const term = this.value.toLowerCase();
                const items = document.querySelectorAll('.pub-list li');
                let hasResult = false;

                items.forEach(item => {
                    if (item.innerText.toLowerCase().includes(term)) {
                        item.style.display = '';
                        hasResult = true;
                    } else {
                        item.style.display = 'none';
                    }
                });

                const noMsg = document.getElementById('noResultsMsg');
                if (noMsg) noMsg.style.display = hasResult ? 'none' : 'block';
            }, 300); // 300 毫秒后执行
        });
    }

    // 手机吸顶 (这部分保留你原来的不变)
    const searchContainer = document.getElementById('searchContainer');
    const searchPlaceholder = document.getElementById('searchPlaceholder');
    
    if (searchContainer && searchPlaceholder) {
        window.addEventListener('scroll', () => {
            if (window.innerWidth < 992) {
                const rect = searchPlaceholder.getBoundingClientRect();
                const shouldFix = rect.top <= 76;
                
                if (shouldFix && !searchContainer.classList.contains('search-is-fixed')) {
                    searchContainer.classList.add('search-is-fixed');
                    searchPlaceholder.classList.add('show');
                } else if (!shouldFix && searchContainer.classList.contains('search-is-fixed')) {
                    searchContainer.classList.remove('search-is-fixed');
                    searchPlaceholder.classList.remove('show');
                }
            } else {
                searchContainer.classList.remove('search-is-fixed');
                searchPlaceholder.classList.remove('show');
            }
        });
    }
}

// 9. 新闻系统逻辑 (Pagination & Filter)
function initNewsSystem() {
    const searchInput = document.getElementById('newsSearchInput');
    const catLinks = document.querySelectorAll('.category-filter');
    
    // 缓存所有新闻条目
    newsState.allItems = Array.from(document.querySelectorAll('.news-item'));
    
    // 首次渲染：全部显示
    runNewsFilter('', 'all');

    // 绑定搜索
    if (searchInput) {
        let newsSearchTimeout; // 【新增】：新闻专用的定时器变量

        searchInput.addEventListener('keyup', (e) => {
            clearTimeout(newsSearchTimeout); // 【新增】：打断倒计时

            // 【新增】：设置倒计时
            newsSearchTimeout = setTimeout(() => {
                // 清除分类高亮
                catLinks.forEach(l => l.classList.remove('text-seu-green', 'fw-bold'));
                runNewsFilter(e.target.value.toLowerCase(), 'all');
            }, 300); // 300 毫秒后执行
        });
    }

    // 绑定分类 (这部分保留你原来的不变)
    catLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            catLinks.forEach(l => l.classList.remove('text-seu-green', 'fw-bold'));
            link.classList.add('text-seu-green', 'fw-bold');
            
            // 切换分类时清空搜索框
            if (searchInput) searchInput.value = '';
            runNewsFilter('', link.getAttribute('data-filter'));
        });
    });
}

// 9.1 新闻过滤核心函数
function runNewsFilter(term, cat) {
    newsState.visibleItems = []; // 清空当前结果集

    newsState.allItems.forEach(item => {
        const text = item.innerText.toLowerCase();
        const itemCat = item.getAttribute('data-category') || '';
        
        const matchSearch = text.includes(term);
        const matchCat = cat === 'all' || itemCat.includes(cat);

        if (matchSearch && matchCat) {
            newsState.visibleItems.push(item); // 加入可见列表
        } else {
            item.style.display = 'none'; // 立即隐藏
        }
    });

    // 提示
    const noMsg = document.getElementById('noNewsMsg');
    if(noMsg) noMsg.style.display = newsState.visibleItems.length === 0 ? 'block' : 'none';

    // 重置分页
    newsState.currentPage = 1;
    renderPagination();
}

// 9.2 新闻分页按钮渲染
function renderPagination() {
    const container = document.getElementById('pagination-container');
    if(!container) return;

    const total = Math.ceil(newsState.visibleItems.length / newsState.itemsPerPage);
    
    // 一页以内，隐藏按钮
    if (total <= 1) {
        container.style.display = 'none';
        displayCurrentPageItems();
        return;
    }

    container.style.display = 'flex';
    let html = `
        <li class="page-item ${newsState.currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0)" onclick="switchNewsPage(${newsState.currentPage - 1})">Prev</a>
        </li>
    `;

    for (let i = 1; i <= total; i++) {
        html += `
            <li class="page-item ${newsState.currentPage === i ? 'active' : ''}">
                <a class="page-link ${newsState.currentPage === i ? 'bg-seu-green border-seu-green' : 'text-dark'}" 
                   href="javascript:void(0)" onclick="switchNewsPage(${i})">${i}</a>
            </li>
        `;
    }

    html += `
        <li class="page-item ${newsState.currentPage === total ? 'disabled' : ''}">
            <a class="page-link text-dark" href="javascript:void(0)" onclick="switchNewsPage(${newsState.currentPage + 1})">Next</a>
        </li>
    `;

    container.innerHTML = html;
    displayCurrentPageItems();
}

// 9.3 实际渲染页面条目
function displayCurrentPageItems() {
    // 再次全部隐藏
    newsState.allItems.forEach(el => el.style.display = 'none');

    const start = (newsState.currentPage - 1) * newsState.itemsPerPage;
    const end = start + newsState.itemsPerPage;
    const itemsToShow = newsState.visibleItems.slice(start, end);

    itemsToShow.forEach(item => {
        item.style.display = 'block';
        // 重新触发动画
        item.classList.remove('aos-animate');
        setTimeout(() => item.classList.add('aos-animate'), 50);
    });
}

// 10. 相册页：高级筛选 (带动画)
function initGalleryFeatures() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length === 0) return;

    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 按钮UI
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                // 第一步：CSS动画淡出
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    const shouldShow = category === 'all' || item.classList.contains(category);
                    if (shouldShow) {
                        item.style.display = 'block';
                        // 第二步：淡入
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300); // 必须等待淡出动画完成
            });
        });
    });
}


// =========================================
// 全局暴露函数 (Exposed to HTML onclick)
// =========================================

// 1. 新闻分页切换 (HTML 调用)
window.switchNewsPage = function(page) {
    const total = Math.ceil(newsState.visibleItems.length / newsState.itemsPerPage);
    if(page < 1 || page > total) return;
    
    newsState.currentPage = page;
    renderPagination();
    // 平滑回到列表顶部
    const feed = document.getElementById('news-feed');
    if(feed) performSmartScroll('#news-feed');
};

// 2. 复制文本 (Email/WeChat/Text)
window.copyContent = function(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Copied to clipboard!\n已复制: " + text);
        }).catch(err => alert("Copy failed. Please manually copy."));
    } else {
        alert("Your browser does not support auto-copy.\nText: " + text);
    }
};

// 4. 打开新闻详情弹窗 (News Card Read More)
window.openNewsModal = function(el, title, date, category, content, imgSrc) {
    if (window.event) window.event.preventDefault();

    // 填充数据
    const setText = (id, txt) => { 
        const node = document.getElementById(id); 
        if(node) node.innerText = txt; 
    };
    
    setText('modalTitle', title);
    setText('modalDate', date);
    setText('modalCategory', category);
    
    const contentNode = document.getElementById('modalContent');
    if(contentNode) contentNode.innerHTML = content; // 支持HTML格式

    const imgNode = document.getElementById('modalImage');
    if(imgNode) {
        imgNode.src = imgSrc;
        imgNode.style.display = imgSrc ? 'block' : 'none'; // 如果没图则隐藏
    }

    // 显示
    const modalEl = document.getElementById('newsDetailModal');
    if(modalEl) new bootstrap.Modal(modalEl).show();
};