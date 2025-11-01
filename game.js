// Game state
let currentRound = 0;
let votingHistory = [];
let gameScenarios = [];

// Define scenarios for the game
function initializeScenarios() {
    gameScenarios = [
        {
            description: "あなたの町では、公園の整備と図書館の改修が課題になっています。",
            candidateA: {
                policies: [
                    "大型ショッピングモールを誘致",
                    "高齢者向け福祉施設の充実",
                    "税金の据え置き"
                ]
            },
            candidateB: {
                policies: [
                    "若者向けコワーキングスペースの設置",
                    "公園とスポーツ施設の整備",
                    "IT教育プログラムの拡充"
                ]
            },
            outcomes: {
                A: "町は高齢者向けの施設が充実しましたが、若者の流出が続いています。",
                B: "若者が集まる活気ある町になり、新しいビジネスも生まれています！",
                abstain: "投票率が低く、特定の支持団体が強い候補Aが勝利。若者向けの政策は後回しに..."
            }
        },
        {
            description: "町の財政が厳しい中、教育と環境のどちらに投資すべきか議論になっています。",
            candidateA: {
                policies: [
                    "学校施設の最新化",
                    "奨学金制度の拡充",
                    "プログラミング教育の必修化"
                ]
            },
            candidateB: {
                policies: [
                    "再生可能エネルギーの導入",
                    "自然保護区の拡大",
                    "エコツーリズムの推進"
                ]
            },
            outcomes: {
                A: "教育環境が向上し、若者の学力が上昇。将来の町を支える人材が育っています！",
                B: "環境に優しい町として注目され、移住者が増加。持続可能な発展を実現！",
                abstain: "財政問題が解決されず、両方の予算が削減。若者が声を上げなかったため..."
            }
        },
        {
            description: "新しい交通システムの導入について、意見が分かれています。",
            candidateA: {
                policies: [
                    "自動車道路の拡張",
                    "無料駐車場の増設",
                    "ガソリン税の軽減"
                ]
            },
            candidateB: {
                policies: [
                    "自転車専用レーンの整備",
                    "シェアサイクルシステムの導入",
                    "深夜バスの運行開始"
                ]
            },
            outcomes: {
                A: "車での移動は便利になりましたが、渋滞と環境問題が悪化...",
                B: "若者が使いやすい交通網が完成！深夜まで遊べる町になりました！",
                abstain: "投票しなかった結果、現状維持。不便な交通事情が続いています..."
            }
        }
    ];
}

function startGame() {
    initializeScenarios();
    currentRound = 0;
    votingHistory = [];
    showScreen('game-screen');
    loadRound();
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function loadRound() {
    if (currentRound >= gameScenarios.length) {
        showFinalScreen();
        return;
    }

    const scenario = gameScenarios[currentRound];
    document.getElementById('round-number').textContent = currentRound + 1;
    document.getElementById('scenario-description').textContent = scenario.description;

    // Load candidate A policies
    const candidateAList = document.getElementById('candidate-a-policies');
    candidateAList.innerHTML = '';
    scenario.candidateA.policies.forEach(policy => {
        const li = document.createElement('li');
        li.textContent = policy;
        candidateAList.appendChild(li);
    });

    // Load candidate B policies
    const candidateBList = document.getElementById('candidate-b-policies');
    candidateBList.innerHTML = '';
    scenario.candidateB.policies.forEach(policy => {
        const li = document.createElement('li');
        li.textContent = policy;
        candidateBList.appendChild(li);
    });
}

function vote(choice) {
    votingHistory.push(choice);
    showResults(choice);
}

function showResults(playerChoice) {
    const scenario = gameScenarios[currentRound];
    
    // Simulate other voters
    // If player abstains, turnout is low (30-40%)
    // If player votes, turnout is higher (60-70%)
    let candidateAVotes, candidateBVotes, abstainVotes;
    
    if (playerChoice === 'abstain') {
        // Low turnout scenario
        candidateAVotes = 20 + Math.random() * 15;
        candidateBVotes = 10 + Math.random() * 10;
        abstainVotes = 100 - candidateAVotes - candidateBVotes;
    } else {
        // Higher turnout
        if (playerChoice === 'A') {
            candidateAVotes = 30 + Math.random() * 10;
            candidateBVotes = 25 + Math.random() * 10;
        } else {
            candidateAVotes = 25 + Math.random() * 10;
            candidateBVotes = 30 + Math.random() * 10;
        }
        abstainVotes = 100 - candidateAVotes - candidateBVotes;
    }

    // Calculate turnout rate from actual votes
    const turnoutRate = candidateAVotes + candidateBVotes;

    // Determine winner
    const winner = candidateAVotes > candidateBVotes ? 'A' : 'B';

    // Display results
    const resultDetails = document.getElementById('result-details');
    resultDetails.innerHTML = `
        <div class="result-bar">
            <div class="result-bar-label">
                <span>候補者A</span>
                <span>${candidateAVotes.toFixed(1)}%</span>
            </div>
            <div class="result-bar-container">
                <div class="result-bar-fill candidate-a" style="width: ${candidateAVotes}%"></div>
            </div>
        </div>
        <div class="result-bar">
            <div class="result-bar-label">
                <span>候補者B</span>
                <span>${candidateBVotes.toFixed(1)}%</span>
            </div>
            <div class="result-bar-container">
                <div class="result-bar-fill candidate-b" style="width: ${candidateBVotes}%"></div>
            </div>
        </div>
        <div class="result-bar">
            <div class="result-bar-label">
                <span>投票せず</span>
                <span>${abstainVotes.toFixed(1)}%</span>
            </div>
            <div class="result-bar-container">
                <div class="result-bar-fill abstain" style="width: ${abstainVotes}%"></div>
            </div>
        </div>
    `;

    // Display outcome message
    const outcomeMessage = document.getElementById('outcome-message');
    let outcomeText;
    let outcomeClass;

    if (playerChoice === 'abstain') {
        outcomeText = `<h3><i class="fas fa-face-frown"></i> 投票しなかった結果...</h3><p>${scenario.outcomes.abstain}</p>`;
        outcomeClass = 'bad';
    } else {
        outcomeText = `<h3><i class="fas fa-trophy"></i> ${winner === playerChoice ? '選んだ候補が当選！' : '残念、別の候補が当選...'}</h3><p>${scenario.outcomes[winner]}</p>`;
        outcomeClass = winner === playerChoice ? 'good' : 'neutral';
    }

    outcomeMessage.innerHTML = outcomeText;
    outcomeMessage.className = outcomeClass;

    // Display stats
    document.getElementById('turnout-rate').textContent = turnoutRate.toFixed(1) + '%';
    document.getElementById('your-votes').innerHTML = votingHistory.map(v => {
        if (v === 'abstain') return '<i class="fas fa-xmark"></i>';
        return v;
    }).join(', ');

    // Update button
    const nextBtn = document.getElementById('next-btn');
    if (currentRound < gameScenarios.length - 1) {
        nextBtn.textContent = '次のラウンドへ';
        nextBtn.onclick = nextRound;
    } else {
        nextBtn.textContent = '結果を見る';
        nextBtn.onclick = showFinalScreen;
    }

    showScreen('result-screen');
}

function nextRound() {
    currentRound++;
    showScreen('game-screen');
    loadRound();
}

function showFinalScreen() {
    const votedCount = votingHistory.filter(v => v !== 'abstain').length;
    const totalRounds = gameScenarios.length;
    
    let finalMessage = '';
    let messageClass = '';

    if (votedCount === totalRounds) {
        finalMessage = `
            <div class="outcome-message good">
                <h3><i class="fas fa-star"></i> 素晴らしい！</h3>
                <p>あなたは全てのラウンドで投票しました！</p>
                <p>投票することで、社会に参加し、未来を作ることができます。</p>
                <p><strong>実際の選挙でも、ぜひ投票に行ってください！</strong></p>
            </div>
        `;
    } else if (votedCount > 0) {
        finalMessage = `
            <div class="outcome-message neutral">
                <h3><i class="fas fa-thumbs-up"></i> 良い判断！</h3>
                <p>あなたは${votedCount}/${totalRounds}回投票しました。</p>
                <p>投票することで、あなたの声を届けることができます。</p>
                <p><strong>次はすべての選挙で投票してみましょう！</strong></p>
            </div>
        `;
    } else {
        finalMessage = `
            <div class="outcome-message bad">
                <h3><i class="fas fa-face-sad-tear"></i> 残念...</h3>
                <p>あなたは一度も投票しませんでした。</p>
                <p>投票しないと、あなたの意見は政治に反映されません。</p>
                <p><strong>次は勇気を出して投票してみましょう！</strong></p>
            </div>
        `;
    }

    document.getElementById('final-message').innerHTML = finalMessage;
    showScreen('final-screen');
}

function restartGame() {
    startGame();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeScenarios();
});
