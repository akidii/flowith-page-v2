import { initScene, addPieceToPuzzle, clearScene, setClickCallback } from './three_scene.js';
import { jigsawMapping, projects, skills } from './content_data.js';

let terminalForm, terminalInput, puzzleSummary;

function init() {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) return;

    terminalForm = document.getElementById('terminal-form');
    terminalInput = document.getElementById('terminal-input');
    puzzleSummary = document.getElementById('puzzle-summary');

    if (terminalForm) {
        terminalForm.addEventListener('submit', handleTerminalSubmit);
        terminalInput.focus();
    }
    
    initScene(canvasContainer);
    setClickCallback(handlePieceClick);
}

function handlePieceClick(id) {
    const [type, key] = id.split('-');
    if (type === 'project') {
        const project = projects[key];
        if (project && project.url) {
            window.location.hash = `#/${project.url}`;
        }
    }
}


function handleTerminalSubmit(e) {
    e.preventDefault();
    const query = terminalInput.value.toLowerCase();
    if (!query) return;

    const revealedPieces = new Set();
    const queryWords = query.split(/\s+/);

    queryWords.forEach(word => {
        for (const trigger in jigsawMapping) {
            if (word.includes(trigger)) {
                jigsawMapping[trigger].forEach(id => revealedPieces.add(id));
            }
        }
    });
    
    if(revealedPieces.size > 0){
        revealedPieces.forEach(id => {
            const [type, key] = id.split('-');
            let pieceData;
            if (type === 'project') pieceData = projects[key];
            else if (type === 'skill') pieceData = skills[key];
            
            if (pieceData) {
                addPieceToPuzzle({
                    id: id,
                    label: pieceData.name,
                    description: pieceData.description || `Skill: ${pieceData.name}`
                });
            }
        });

        if (puzzleSummary) {
            gsap.to(puzzleSummary, { opacity: 0, duration: 0.3, onComplete: () => {
                puzzleSummary.textContent = "You've discovered: An executor who uses communication engineering thinking to solve AI problems.";
                gsap.to(puzzleSummary, { opacity: 1, duration: 0.5 });
            }});
        }

    } else {
         if (puzzleSummary) {
            gsap.to(puzzleSummary, { opacity: 0, duration: 0.3, onComplete: () => {
                puzzleSummary.textContent = "No direct match. Try 'execution', 'design', 'technical', or 'learning'.";
                gsap.to(puzzleSummary, { opacity: 1, duration: 0.5 });
            }});
        }
    }


    terminalInput.value = '';
}

function cleanup() {
    clearScene();
    if (terminalForm) {
        terminalForm.removeEventListener('submit', handleTerminalSubmit);
    }
}

export { init, cleanup };
