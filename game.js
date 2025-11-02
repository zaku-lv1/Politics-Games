// Game state
let currentRound = 0;
let votingHistory = [];
let gameScenarios = [];
let allScenarios = [];
let partyScores = {}; // Track how many votes each party got

// Define all political parties
const POLITICAL_PARTIES = [
    {
        id: 'progressive',
        name: '未来進歩党',
        icon: 'fas fa-rocket',
        color: '#4CAF50',
        ideology: 'progressive',
        policies: [
            'IT産業の育成と若者雇用創出',
            '再生可能エネルギーへの完全移行',
            '教育の完全無償化',
            'ベーシックインカムの導入'
        ],
        isBad: false
    },
    {
        id: 'youth',
        name: '若者第一党',
        icon: 'fas fa-users',
        color: '#2196F3',
        ideology: 'youth-focused',
        policies: [
            '若者の政治参加促進',
            '学生ローン免除制度',
            '起業支援と税制優遇',
            '深夜交通網の拡充'
        ],
        isBad: false
    },
    {
        id: 'green',
        name: '環境保護党',
        icon: 'fas fa-leaf',
        color: '#8BC34A',
        ideology: 'environmental',
        policies: [
            '自然保護区の拡大',
            'プラスチック完全廃止',
            '有機農業の推進',
            'カーボンニュートラル達成'
        ],
        isBad: false
    },
    {
        id: 'moderate',
        name: '中道改革党',
        icon: 'fas fa-balance-scale',
        color: '#FF9800',
        ideology: 'centrist',
        policies: [
            'バランスの取れた予算配分',
            '段階的な改革推進',
            '全世代型社会保障',
            '持続可能な経済成長'
        ],
        isBad: false
    },
    {
        id: 'welfare',
        name: '福祉充実党',
        icon: 'fas fa-heart',
        color: '#E91E63',
        ideology: 'welfare-focused',
        policies: [
            '医療費の完全無料化',
            '高齢者福祉の充実',
            '子育て支援金の増額',
            '障がい者支援の強化'
        ],
        isBad: false
    },
    {
        id: 'conservative',
        name: '伝統保守党',
        icon: 'fas fa-landmark',
        color: '#795548',
        ideology: 'conservative',
        policies: [
            '伝統文化の保護',
            '財政健全化優先',
            '既存インフラの維持',
            '治安強化と秩序維持'
        ],
        isBad: false
    },
    {
        id: 'corrupt',
        name: '利権優先党',
        icon: 'fas fa-money-bill-wave',
        color: '#607D8B',
        ideology: 'corrupt',
        policies: [
            '特定企業への優遇措置',
            '議員報酬の大幅増額',
            '情報公開の制限',
            '既得権益の保護'
        ],
        isBad: true
    },
    {
        id: 'authoritarian',
        name: '強権統制党',
        icon: 'fas fa-gavel',
        color: '#424242',
        ideology: 'authoritarian',
        policies: [
            '監視社会の構築',
            '言論統制の強化',
            '個人の自由の制限',
            '中央集権化の推進'
        ],
        isBad: true
    }
];

// Define all possible scenarios
function initializeAllScenarios() {
    allScenarios = [
        {
            description: "あなたの町では、公園の整備と図書館の改修が課題になっています。",
            theme: 'infrastructure'
        },
        {
            description: "町の財政が厳しい中、教育と環境のどちらに投資すべきか議論になっています。",
            theme: 'budget'
        },
        {
            description: "新しい交通システムの導入について、意見が分かれています。",
            theme: 'transportation'
        },
        {
            description: "若者の流出が深刻化し、町の活性化が急務となっています。",
            theme: 'youth'
        },
        {
            description: "高齢化が進む中、医療・福祉制度の見直しが求められています。",
            theme: 'welfare'
        },
        {
            description: "地域経済の低迷が続き、雇用創出が重要な課題です。",
            theme: 'economy'
        },
        {
            description: "気候変動への対応として、環境政策の強化が議論されています。",
            theme: 'environment'
        },
        {
            description: "教育格差の是正と次世代育成が重要なテーマとなっています。",
            theme: 'education'
        },
        {
            description: "デジタル化の推進と個人情報保護のバランスが問われています。",
            theme: 'digital'
        },
        {
            description: "治安維持と個人の自由のバランスについて意見が分かれています。",
            theme: 'security'
        },
        {
            description: "文化・芸術振興と財政負担について議論が白熱しています。",
            theme: 'culture'
        },
        {
            description: "地方分権と中央集権のどちらを目指すべきか検討されています。",
            theme: 'governance'
        }
    ];
}

// Select random scenarios for the game
function initializeScenarios() {
    initializeAllScenarios();
    
    // Shuffle and select 3 random scenarios
    const shuffled = [...allScenarios].sort(() => Math.random() - 0.5);
    gameScenarios = shuffled.slice(0, 3);
}

function startGame() {
    initializeScenarios();
    currentRound = 0;
    votingHistory = [];
    partyScores = {};
    showScreen('game-screen');
    loadRound();
}

// Select parties for this round
function selectPartiesForRound() {
    const goodParties = POLITICAL_PARTIES.filter(p => !p.isBad);
    const badParties = POLITICAL_PARTIES.filter(p => p.isBad);
    
    // 10% chance to include a bad party
    const includeBadParty = Math.random() < 0.1;
    
    let selectedParties = [];
    
    if (includeBadParty && badParties.length > 0) {
        // Select 2 good parties and 1 bad party
        const shuffledGood = [...goodParties].sort(() => Math.random() - 0.5);
        const shuffledBad = [...badParties].sort(() => Math.random() - 0.5);
        selectedParties = [...shuffledGood.slice(0, 2), shuffledBad[0]];
    } else {
        // Select 3 good parties
        const shuffledGood = [...goodParties].sort(() => Math.random() - 0.5);
        selectedParties = shuffledGood.slice(0, 3);
    }
    
    // Shuffle final selection
    return selectedParties.sort(() => Math.random() - 0.5);
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
    const parties = selectPartiesForRound();
    scenario.parties = parties;
    
    document.getElementById('round-number').textContent = currentRound + 1;
    document.getElementById('scenario-description').textContent = scenario.description;

    // Create party containers dynamically
    const container = document.querySelector('.candidates-container');
    container.innerHTML = '';
    
    // Add party cards
    parties.forEach((party, index) => {
        const partyCard = document.createElement('div');
        partyCard.className = 'candidate party-card';
        partyCard.style.borderColor = party.color;
        
        partyCard.innerHTML = `
            <div class="candidate-header">
                <h3>${party.name}</h3>
                <span class="candidate-icon" style="color: ${party.color}">
                    <i class="${party.icon}"></i>
                </span>
            </div>
            <div class="candidate-info">
                <h4>政策：</h4>
                <ul>
                    ${party.policies.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>
            <button onclick="vote('${party.id}')" class="btn btn-vote" style="background-color: ${party.color}">
                ${party.name}に投票する
            </button>
        `;
        
        container.appendChild(partyCard);
    });
    
    // Add abstain option
    const abstainCard = document.createElement('div');
    abstainCard.className = 'candidate abstain';
    abstainCard.innerHTML = `
        <div class="candidate-header">
            <h3>投票しない</h3>
            <span class="candidate-icon"><i class="fas fa-bed"></i></span>
        </div>
        <div class="candidate-info">
            <p>「忙しいから」「どうせ変わらないから」と投票に行かない...</p>
            <p class="warning"><i class="fas fa-exclamation-triangle"></i> でも、それで本当にいいの？</p>
        </div>
        <button onclick="vote('abstain')" class="btn btn-abstain">投票しない</button>
    `;
    container.appendChild(abstainCard);
}

function vote(choice) {
    votingHistory.push(choice);
    
    // Track party scores
    if (choice !== 'abstain') {
        partyScores[choice] = (partyScores[choice] || 0) + 1;
    }
    
    showResults(choice);
}

function showResults(playerChoice) {
    const scenario = gameScenarios[currentRound];
    const parties = scenario.parties;
    
    // Simulate other voters with realistic distribution
    let votes = {};
    let totalVotes = 0;
    
    if (playerChoice === 'abstain') {
        // Low turnout scenario - bad parties have advantage
        const hasBadParty = parties.some(p => p.isBad);
        
        parties.forEach(party => {
            if (party.isBad) {
                // Bad parties get more votes when turnout is low
                votes[party.id] = 15 + Math.random() * 10;
            } else {
                votes[party.id] = 5 + Math.random() * 8;
            }
            totalVotes += votes[party.id];
        });
        
        // Add player's non-vote
        const abstainVotes = 100 - totalVotes;
        votes.abstain = abstainVotes;
    } else {
        // Higher turnout - good parties have better chances
        parties.forEach(party => {
            if (party.id === playerChoice) {
                votes[party.id] = 25 + Math.random() * 10;
            } else if (party.isBad) {
                votes[party.id] = 8 + Math.random() * 7;
            } else {
                votes[party.id] = 18 + Math.random() * 10;
            }
            totalVotes += votes[party.id];
        });
        
        const abstainVotes = 100 - totalVotes;
        votes.abstain = Math.max(0, abstainVotes);
    }

    // Determine winner
    let winner = null;
    let maxVotes = 0;
    parties.forEach(party => {
        if (votes[party.id] > maxVotes) {
            maxVotes = votes[party.id];
            winner = party;
        }
    });

    // Calculate turnout rate
    const turnoutRate = totalVotes;

    // Display results
    const resultDetails = document.getElementById('result-details');
    let resultHTML = '';
    
    parties.forEach(party => {
        const isWinner = party.id === winner.id;
        resultHTML += `
            <div class="result-bar">
                <div class="result-bar-label">
                    <span style="color: ${party.color}">
                        <i class="${party.icon}"></i> ${party.name}
                        ${isWinner ? '<i class="fas fa-crown"></i>' : ''}
                    </span>
                    <span>${votes[party.id].toFixed(1)}%</span>
                </div>
                <div class="result-bar-container">
                    <div class="result-bar-fill" style="width: ${votes[party.id]}%; background-color: ${party.color}"></div>
                </div>
            </div>
        `;
    });
    
    resultHTML += `
        <div class="result-bar">
            <div class="result-bar-label">
                <span>投票せず</span>
                <span>${votes.abstain.toFixed(1)}%</span>
            </div>
            <div class="result-bar-container">
                <div class="result-bar-fill abstain" style="width: ${votes.abstain}%"></div>
            </div>
        </div>
    `;
    
    resultDetails.innerHTML = resultHTML;

    // Display outcome message
    const outcomeMessage = document.getElementById('outcome-message');
    let outcomeText;
    let outcomeClass;

    if (winner.isBad) {
        // Bad party won
        outcomeText = `
            <h3><i class="fas fa-face-frown"></i> 危険な結果...</h3>
            <p><strong>${winner.name}が勝利しました。</strong></p>
            <p>社会が悪い方向に向かっています。透明性が失われ、市民の権利が制限されていきます...</p>
            ${playerChoice === 'abstain' ? '<p class="warning">投票しなかったことで、このような結果を招いてしまいました。</p>' : ''}
        `;
        outcomeClass = 'bad';
    } else if (playerChoice === 'abstain') {
        outcomeText = `
            <h3><i class="fas fa-face-meh"></i> 投票しなかった結果...</h3>
            <p><strong>${winner.name}が勝利しました。</strong></p>
            <p>あなたの声は届きませんでした。もし投票していたら、結果が変わったかもしれません...</p>
        `;
        outcomeClass = 'neutral';
    } else {
        const playerVoted = playerChoice === winner.id;
        outcomeText = `
            <h3><i class="fas fa-${playerVoted ? 'star' : 'thumbs-up'}"></i> ${playerVoted ? '選んだ政党が勝利！' : '投票ありがとう！'}</h3>
            <p><strong>${winner.name}が勝利しました。</strong></p>
            <p>${playerVoted ? '素晴らしい！あなたの一票が社会を良い方向に導きました！' : '残念ながら別の政党が勝利しましたが、投票したことに意味があります。'}</p>
        `;
        outcomeClass = playerVoted ? 'good' : 'neutral';
    }

    outcomeMessage.innerHTML = outcomeText;
    outcomeMessage.className = outcomeClass;

    // Display stats
    document.getElementById('turnout-rate').textContent = turnoutRate.toFixed(1) + '%';
    
    const votingHistoryDisplay = votingHistory.map(v => {
        if (v === 'abstain') return '<i class="fas fa-xmark"></i>';
        const party = POLITICAL_PARTIES.find(p => p.id === v);
        return party ? `<span style="color: ${party.color}">${party.name}</span>` : v;
    }).join(', ');
    
    document.getElementById('your-votes').innerHTML = votingHistoryDisplay;

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
    
    // Check if any bad parties won during the game
    let badPartyVoteCount = 0;
    votingHistory.forEach(vote => {
        const party = POLITICAL_PARTIES.find(p => p.id === vote);
        if (party && party.isBad) {
            badPartyVoteCount++;
        }
    });
    
    // Calculate good party votes
    const goodPartyVotes = votingHistory.filter(v => {
        if (v === 'abstain') return false;
        const party = POLITICAL_PARTIES.find(p => p.id === v);
        return party && !party.isBad;
    }).length;
    
    let finalMessage = '';
    let messageClass = '';
    let endingType = '';

    // Determine ending type
    if (badPartyVoteCount > 0 || votedCount === 0) {
        // BAD END
        endingType = 'バッドエンド';
        finalMessage = `
            <div class="outcome-message bad">
                <h3><i class="fas fa-skull-crossbones"></i> ${endingType}</h3>
                <p><strong>社会が暗い方向に進んでしまいました...</strong></p>
                ${badPartyVoteCount > 0 ? '<p>危険な政党に投票したことで、市民の自由が脅かされています。</p>' : ''}
                ${votedCount === 0 ? '<p>一度も投票しなかったため、悪意ある勢力が台頭してしまいました。</p>' : ''}
                <p class="warning">投票は社会を守る重要な権利です。もう一度プレイして、より良い未来を目指しましょう！</p>
            </div>
        `;
    } else if (votedCount === 1) {
        // NORMAL END (but not good)
        endingType = 'ノーマルエンド';
        finalMessage = `
            <div class="outcome-message neutral">
                <h3><i class="fas fa-face-meh"></i> ${endingType}</h3>
                <p>あなたは${votedCount}/${totalRounds}回だけ投票しました。</p>
                <p>参加することは素晴らしいですが、もっと積極的に政治に関わることで、より良い社会を作ることができます。</p>
                <p><strong>次回はすべての選挙で投票してみましょう！</strong></p>
            </div>
        `;
    } else if (votedCount === 2) {
        // GOOD END
        endingType = 'グッドエンド';
        finalMessage = `
            <div class="outcome-message good">
                <h3><i class="fas fa-thumbs-up"></i> ${endingType}</h3>
                <p>あなたは${votedCount}/${totalRounds}回投票しました！</p>
                <p>積極的に社会に参加する姿勢は素晴らしいです。あなたの声が政治に届いています。</p>
                <p><strong>次はパーフェクトを目指してみましょう！</strong></p>
            </div>
        `;
    } else if (votedCount === totalRounds && goodPartyVotes === totalRounds) {
        // HAPPY END (Perfect!)
        endingType = 'ハッピーエンド';
        finalMessage = `
            <div class="outcome-message good happy-end">
                <h3><i class="fas fa-trophy"></i> ${endingType}！<i class="fas fa-star"></i></h3>
                <p><strong>完璧です！あなたは全てのラウンドで投票し、社会を良い方向に導きました！</strong></p>
                <p>町は活気に満ち、人々は希望を持って暮らしています。これもあなたの一票があったからこそです。</p>
                <p class="highlight">✨ あなたのような市民がいれば、未来は明るい！✨</p>
                <p><strong>実際の選挙でも、ぜひこの情熱を持って投票に行ってください！</strong></p>
            </div>
        `;
    } else {
        // Voted all rounds but mixed results
        endingType = 'グッドエンド';
        finalMessage = `
            <div class="outcome-message good">
                <h3><i class="fas fa-star"></i> ${endingType}！</h3>
                <p>素晴らしい！あなたは全てのラウンドで投票しました！</p>
                <p>投票することで、社会に参加し、未来を作ることができます。</p>
                <p><strong>実際の選挙でも、ぜひ投票に行ってください！</strong></p>
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
