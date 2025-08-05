const projects = {
    interviewAssistant: {
        id: 'project-interviewAssistant',
        name: 'AI Interview Assistant',
        description: 'Developed product, simplifying interview prep with AI.',
        url: 'case-study-interview-assistant',
    },
    productAnalysis: {
        id: 'project-productAnalysis',
        name: 'Product Analysis',
        description: 'Analyzed AI products using structured design principles.',
        url: 'case-study-product-analysis'
    },
    marketResearch: {
        id: 'project-marketResearch',
        name: 'Market Research',
        description: 'Identified market gaps for an AI dialogue plugin.',
        url: 'case-study-market-research'
    },
    vibeCoding: {
        id: 'project-vibeCoding',
        name: 'vibe coding Plugin',
        description: 'In-progress AI plugin to enhance coding efficiency.',
        url: 'case-study-vibe-coding'
    }
};

const skills = {
    commsEng: {
        id: 'skill-commsEng',
        name: 'Communication Engineering',
        description: 'Deep technical foundation in systems and signals.'
    },
    productStrategy: {
        id: 'skill-productStrategy',
        name: 'Product Strategy',
        description: 'Defining product vision, roadmap, and market fit.'
    },
    agile: {
        id: 'skill-agile',
        name: 'Agile Execution',
        description: 'Delivering products in fast-paced, iterative environments.'
    },
    agenticAI: {
        id: 'skill-agenticAI',
        name: 'Agentic AI',
        description: 'Exploring proactive, goal-oriented AI systems.'
    },
    python: {
        id: 'skill-python',
        name: 'Python',
        description: 'Core programming language for AI/ML development.'
    },
    sysArch: {
        id: 'skill-sysArch',
        name: 'System Architecture',
        description: 'Designing robust and scalable AI system diagrams.'
    }
};

const jigsawMapping = {
    'execution': ['project-interviewAssistant', 'project-vibeCoding', 'skill-agile'],
    '创意': ['project-productAnalysis', 'project-marketResearch', 'skill-productStrategy'],
    'product': ['project-interviewAssistant', 'project-productAnalysis', 'skill-productStrategy'],
    'design': ['project-productAnalysis', 'project-marketResearch', 'skill-productStrategy'],
    '技术': ['project-vibeCoding', 'skill-commsEng', 'skill-python', 'skill-sysArch'],
    'technical': ['project-vibeCoding', 'skill-commsEng', 'skill-python', 'skill-sysArch'],
    '学习': ['project-vibeCoding', 'skill-agenticAI', 'skill-python'],
    'learning': ['project-vibeCoding', 'skill-agenticAI', 'skill-python'],
    'agent': ['project-vibeCoding', 'skill-agenticAI'],
    'ai': Object.values(projects).map(p => p.id).concat(Object.values(skills).map(s => s.id))
};


const aboutMeContent = {
    title: "About Me",
    narrative: `
        <h2 class="text-3xl font-header text-slate-light mb-3">
            <span class="text-accent">02.</span> About Me
        </h2>
        <div class="space-y-4 text-slate-dark max-w-3xl">
            <p>
                As a Communications Engineering graduate passionate about proactive AI innovation, I am an execution-driven AI Product Manager dedicated to transforming complex ideas into tangible, impactful solutions within the Embodied Intelligence domain.
            </p>
            <p>
                My journey began in the world of bits and signals, providing me with a deep technical foundation in system integration and data transmission. This background is not a traditional path for a PM, but for Embodied Intelligence—where hardware, software, and AI converge—it's a strategic advantage. It allows me to bridge the gap between low-level infrastructure challenges and high-level product features, ensuring robust and seamless user experiences.
            </p>
            <p>
                I thrive on learning and building. Whether it's developing an AI Interview Assistant from scratch or diving into the market for new AI plugins, my focus is always on execution and delivering value. I believe the future of AI is not just in the cloud, but in the physical world, interacting with us and augmenting our reality. My ambition is to be at the forefront of this revolution, building the products that will define the next generation of human-computer interaction.
            </p>
        </div>
    `,
    skills: [
        { category: 'Product Management', items: ['Roadmapping', 'User Research', 'Agile Methodologies', 'Market Analysis', 'A/B Testing'] },
        { category: 'Technical', items: ['Python', 'SQL', 'APIs', 'Machine Learning Concepts', 'System Architecture Design'] },
        { category: 'Tools', items: ['Figma', 'Jira', 'Notion', 'Google Analytics', 'GitHub'] }
    ]
};

export { projects, skills, jigsawMapping, aboutMeContent };
