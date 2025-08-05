import { init as initPuzzle, cleanup as cleanupPuzzle } from './interactive_puzzle.js';

const mainContent = document.getElementById('main-content');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

const modalContainer = document.getElementById('modal-container');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalContentWrapper = document.getElementById('modal-content-wrapper');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.querySelector('#modal-body .prose');
const modalCloseBtn = document.getElementById('modal-close-btn');

const imageLightboxBackdrop = document.getElementById('image-lightbox-backdrop');
const imageLightboxImg = document.getElementById('image-lightbox-img');
const imageLightboxClose = document.getElementById('image-lightbox-close');

let contentData = null;

const routes = {
    '': 'pages/home.html',
    'home': 'pages/home.html',
    'about': 'pages/about.html',
    'portfolio': 'pages/portfolio.html',
    'insights': 'pages/insights.html',
    'contact': 'pages/contact.html',
    'case-study-interview-assistant': 'pages/case_studies/case_study_interview_assistant.html',
    'case-study-product-analysis': 'pages/case_studies/case_study_product_analysis.html',
    'case-study-market-research': 'pages/case_studies/case_study_market_research.html',
    'case-study-vibe-coding': 'pages/case_studies/case_study_vibe_coding.html',
};

async function loadContentData() {
    try {
        const response = await fetch('content.json');
        if (!response.ok) throw new Error('Failed to load content data');
        contentData = await response.json();
    } catch (error) {
        console.error('Error loading content data:', error);
        contentData = {};
    }
}

function populateContent(htmlString, page) {
    if (!contentData) return htmlString;
    
    let populatedHTML = htmlString;
    
    switch(page) {
        case '':
        case 'home':
            populatedHTML = populateHomeContent(populatedHTML);
            break;
        case 'about':
            populatedHTML = populateAboutContent(populatedHTML);
            break;
        case 'portfolio':
            populatedHTML = populatePortfolioContent(populatedHTML);
            break;
        case 'insights':
            populatedHTML = populateInsightsContent(populatedHTML);
            break;
        case 'contact':
            populatedHTML = populateContactContent(populatedHTML);
            break;
        case 'case-study-interview-assistant':
            populatedHTML = populateCaseStudyContent(populatedHTML, 'case-study-interview-assistant');
            break;
        case 'case-study-product-analysis':
            populatedHTML = populateCaseStudyContent(populatedHTML, 'case-study-product-analysis');
            break;
        case 'case-study-market-research':
            populatedHTML = populateCaseStudyContent(populatedHTML, 'case-study-market-research');
            break;
        case 'case-study-vibe-coding':
            populatedHTML = populateCaseStudyContent(populatedHTML, 'case-study-vibe-coding');
            break;
    }
    
    return populatedHTML;
}

function populateHomeContent(html) {
    const home = contentData.home?.hero || {};
    return html
        .replace(/{{title}}/g, home.title || '')
        .replace(/{{subtitle}}/g, home.subtitle || '')
        .replace(/{{prompt}}/g, home.prompt || '');
}

function populateAboutContent(html) {
    const about = contentData.about || {};
    const content = about.content || {};
    const competencies = about.competencies || {};
    const testimonials = contentData.testimonials || [];
    
    let testimonialCards = '';
    testimonials.forEach(testimonial => {
        testimonialCards += `
            <div class="glass-card p-6 flex flex-col h-full">
                <p class="text-slate-dark flex-grow mb-4 italic">"${testimonial.quote}"</p>
                <div class="text-right mt-auto pt-4 border-t border-secondary/50">
                    <p class="font-header text-slate-light">${testimonial.name}</p>
                    <p class="text-sm text-slate-dark">${testimonial.title}</p>
                </div>
            </div>
        `;
    });

    return html
        .replace(/{{sectionNumber}}/g, about.sectionNumber || '')
        .replace(/{{title}}/g, about.title || '')
        .replace(/{{paragraph1}}/g, content.paragraph1 || '')
        .replace(/{{paragraph2}}/g, content.paragraph2 || '')
        .replace(/{{paragraph3}}/g, content.paragraph3 || '')
        .replace(/{{competenciesTitle}}/g, competencies.title || '')
        .replace(/{{pmTitle}}/g, competencies.productManagement?.title || '')
        .replace(/{{pmSkills}}/g, competencies.productManagement?.skills?.map(skill => `<li>${skill}</li>`).join('') || '')
        .replace(/{{techTitle}}/g, competencies.technical?.title || '')
        .replace(/{{techSkills}}/g, competencies.technical?.skills?.map(skill => `<li>${skill}</li>`).join('') || '')
        .replace(/{{toolsTitle}}/g, competencies.tools?.title || '')
        .replace(/{{toolsSkills}}/g, competencies.tools?.skills?.map(skill => `<li>${skill}</li>`).join('') || '')
        .replace(/{{testimonialCards}}/g, testimonialCards);
}

function populatePortfolioContent(html) {
    const portfolio = contentData.portfolio || {};
    const projects = portfolio.projects || {};
    const headers = portfolio.tableHeaders || {};
    
    let projectRows = '';
    Object.values(projects).forEach(project => {
        projectRows += `
            <tr class="border-b border-secondary hover:bg-secondary/50 transition-colors">
                <td class="p-4 font-bold text-slate-light">${project.name}</td>
                <td class="p-4 hidden md:table-cell text-slate-dark">${project.type}</td>
                <td class="p-4 text-slate-dark">${project.focus}</td>
                <td class="p-4 hidden md:table-cell text-slate-dark">${project.role}</td>
                <td class="p-4"><a href="#/${project.url}" class="text-accent hover:underline">${project.link}</a></td>
            </tr>
        `;
    });
    
    return html
        .replace(/{{sectionNumber}}/g, portfolio.sectionNumber || '')
        .replace(/{{title}}/g, portfolio.title || '')
        .replace(/{{description}}/g, portfolio.description || '')
        .replace(/{{headerProject}}/g, headers.project || '')
        .replace(/{{headerType}}/g, headers.type || '')
        .replace(/{{headerFocus}}/g, headers.focus || '')
        .replace(/{{headerRole}}/g, headers.role || '')
        .replace(/{{headerLink}}/g, headers.link || '')
        .replace(/{{projectRows}}/g, projectRows);
}

function populateInsightsContent(html) {
    const insights = contentData.insights || {};
    const articles = insights.articles || [];
    
    let articleCards = '';
    articles.forEach((article, index) => {
        articleCards += `
            <div class="glass-card p-6 flex flex-col cursor-pointer hover:border-accent/50 transition-colors duration-300" data-article-index="${index}">
                <h3 class="font-header text-slate-light text-xl mb-2">${article.title}</h3>
                <p class="text-slate-dark flex-grow mb-4 text-sm">${article.summary}</p>
                <span class="font-header text-sm text-accent self-start mt-auto">Read More &rarr;</span>
            </div>
        `;
    });
    
    return html
        .replace(/{{sectionNumber}}/g, insights.sectionNumber || '')
        .replace(/{{title}}/g, insights.title || '')
        .replace(/{{description}}/g, insights.description || '')
        .replace(/{{articleCards}}/g, articleCards);
}

function populateContactContent(html) {
    const contact = contentData.contact || {};
    
    return html
        .replace(/{{sectionNumber}}/g, contact.sectionNumber || '')
        .replace(/{{preTitle}}/g, contact.preTitle || '')
        .replace(/{{title}}/g, contact.title || '')
        .replace(/{{description}}/g, contact.description || '')
        .replace(/{{cta}}/g, contact.cta || '')
        .replace(/{{email}}/g, contact.email || '');
}

function populateCaseStudyContent(html, caseStudyKey) {
    const caseStudy = contentData.caseStudies?.[caseStudyKey];
    if (!caseStudy) return html;

    const projectKey = Object.keys(contentData.portfolio.projects).find(key => contentData.portfolio.projects[key].url === caseStudyKey);
    const projectData = projectKey ? contentData.portfolio.projects[projectKey] : null;

    const sections = caseStudy.sections || {};
    let sectionsHTML = '';

    Object.values(sections).forEach(section => {
        let sectionContent = `<div class="prose prose-invert max-w-none text-slate-dark prose-headings:text-slate-light prose-strong:text-slate-light prose-a:text-accent hover:prose-a:text-accent/80">${section.content}</div>`;
        if (section.list) {
            sectionContent += '<ul class="list-disc list-inside mt-4 space-y-2">';
            section.list.forEach(item => {
                sectionContent += `<li>${item}</li>`;
            });
            sectionContent += '</ul>';
        }

        sectionsHTML += `
            <section class="case-study-section mb-8">
                <h3>${section.title}</h3>
                ${sectionContent}
            </section>
        `;
    });

    if (projectData && projectData.architecture_image) {
        sectionsHTML += `
            <section class="case-study-section">
                <h3>System Architecture</h3>
                <div class="mt-4 rounded-lg border border-secondary overflow-hidden group">
                    <img src="${projectData.architecture_image}" alt="${caseStudy.title} Architecture" class="architecture-image w-full block transition-transform duration-300 group-hover:scale-105">
                </div>
                <p class="text-center text-sm text-slate-dark mt-2">Click image to enlarge</p>
            </section>
        `;
    }

    return html
        .replace(/{{backToPortfolio}}/g, caseStudy.backToPortfolio || '')
        .replace(/{{title}}/g, caseStudy.title || '')
        .replace(/{{subtitle}}/g, caseStudy.subtitle || '')
        .replace(/{{sections}}/g, sectionsHTML);
}

function openModal(title, content) {
    modalTitle.textContent = title;
    modalBody.innerHTML = marked.parse(content);
    
    modalContainer.classList.remove('hidden');
    modalContainer.classList.add('flex');
    modalBackdrop.classList.remove('hidden');
    
    setTimeout(() => {
        modalBackdrop.classList.remove('opacity-0');
        modalContentWrapper.classList.remove('opacity-0', 'scale-95');
    }, 10);
}

function closeModal() {
    modalBackdrop.classList.add('opacity-0');
    modalContentWrapper.classList.add('opacity-0', 'scale-95');
    
    setTimeout(() => {
        modalContainer.classList.add('hidden');
        modalContainer.classList.remove('flex');
        modalBackdrop.classList.add('hidden');
    }, 300);
}

function openImageLightbox(src) {
    imageLightboxImg.setAttribute('src', src);
    imageLightboxBackdrop.classList.remove('hidden');
    lucide.createIcons();
    
    setTimeout(() => {
        imageLightboxBackdrop.classList.remove('opacity-0');
        imageLightboxImg.classList.remove('opacity-0', 'scale-95');
    }, 10);
}

function closeImageLightbox() {
    imageLightboxBackdrop.classList.add('opacity-0');
    imageLightboxImg.classList.add('opacity-0', 'scale-95');
    
    setTimeout(() => {
        imageLightboxBackdrop.classList.add('hidden');
        imageLightboxImg.setAttribute('src', '');
    }, 300);
}

async function loadPage(page) {
    cleanupPuzzle();
    const path = routes[page] || routes['']; 
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Page not found');
        const content = await response.text();
        
        const populatedContent = populateContent(content, page);
        
        mainContent.innerHTML = populatedContent;
        mainContent.style.opacity = 0;
        gsap.to(mainContent, { opacity: 1, duration: 0.5 });
        
        lucide.createIcons();

        if (page === '' || page === 'home') {
            initPuzzle();
        }

    } catch (error) {
        console.error('Failed to load page:', error);
        mainContent.innerHTML = `<div class="text-center text-accent">Error: Page not found.</div>`;
    }
}

function updateActiveLink(page) {
    const pageId = page.startsWith('case-study') ? 'portfolio' : page;
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').substring(1);
        if (linkPage === (pageId || 'home')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function handleRouting() {
    const page = window.location.hash.substring(2) || 'home';
    loadPage(page);
    updateActiveLink(page);
}

function setupNavigation() {
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('a[href^="#/"]')) {
            mobileMenu.classList.add('hidden');
        } else if (e.target.closest('a[href^="#"]')) {
            mobileMenu.classList.add('hidden');
            const href = e.target.closest('a[href^="#"]').getAttribute('href');
            if(routes[href.substring(1)]) {
            } else {
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    imageLightboxClose.addEventListener('click', closeImageLightbox);
    imageLightboxBackdrop.addEventListener('click', (e) => {
        if (e.target === imageLightboxBackdrop) {
            closeImageLightbox();
        }
    });

    mainContent.addEventListener('click', (e) => {
        const card = e.target.closest('[data-article-index]');
        if (card) {
            const index = card.dataset.articleIndex;
            const article = contentData?.insights?.articles?.[index];
            if (article) {
                openModal(article.title, article.content);
            }
            return;
        }

        const archImage = e.target.closest('.architecture-image');
        if (archImage) {
            openImageLightbox(archImage.getAttribute('src'));
        }
    });
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', async () => {
    await loadContentData();
    handleRouting();
    setupNavigation();
    lucide.createIcons();
});
