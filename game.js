// Game state
let currentRound = 0;
let votingHistory = [];
let gameScenarios = [];
let allScenarios = [];

// Game configuration constants
const CONSISTENCY_THRESHOLD = 0.6; // Need 60% of votes for same ideology to get specialized ending

// Fisher-Yates shuffle algorithm for proper randomization
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

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
    
    // Shuffle and select 5 random scenarios using Fisher-Yates
    const shuffled = shuffleArray(allScenarios);
    gameScenarios = shuffled.slice(0, 5);
}

function startGame() {
    initializeScenarios();
    currentRound = 0;
    votingHistory = [];
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
        const shuffledGood = shuffleArray(goodParties);
        const shuffledBad = shuffleArray(badParties);
        selectedParties = [...shuffledGood.slice(0, 2), shuffledBad[0]];
    } else {
        // Select 3 good parties
        const shuffledGood = shuffleArray(goodParties);
        selectedParties = shuffledGood.slice(0, 3);
    }
    
    // Shuffle final selection
    return shuffleArray(selectedParties);
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
    
    // Count votes by ideology
    let ideologyCounts = {
        progressive: 0,    // 未来進歩党
        'youth-focused': 0,  // 若者第一党
        environmental: 0,  // 環境保護党
        centrist: 0,       // 中道改革党
        'welfare-focused': 0, // 福祉充実党
        conservative: 0,   // 伝統保守党
        bad: 0,            // 悪い政党
        abstain: 0         // 棄権
    };
    
    votingHistory.forEach(vote => {
        if (vote === 'abstain') {
            ideologyCounts.abstain++;
        } else {
            const party = POLITICAL_PARTIES.find(p => p.id === vote);
            if (party) {
                if (party.isBad) {
                    ideologyCounts.bad++;
                } else {
                    ideologyCounts[party.ideology]++;
                }
            }
        }
    });
    
    let finalMessage = '';
    let endingType = '';
    let endingClass = '';

    // Determine ending based on voting patterns
    // Priority: Bad votes > Abstain > Specific ideologies
    
    if (ideologyCounts.bad > 0) {
        // 混沌のエンド - Voted for bad parties
        endingType = '混沌のエンド';
        endingClass = 'bad';
        finalMessage = `
            <div class="outcome-message bad">
                <h3><i class="fas fa-skull-crossbones"></i> ${endingType}</h3>
                <p><strong>社会が混沌に陥ってしまいました...</strong></p>
                <p>危険な政党への投票により、透明性が失われ、市民の自由が脅かされています。</p>
                <p>監視社会が構築され、言論の自由が制限されつつあります。</p>
                <p class="warning">⚠️ 投票は慎重に。政党の政策をしっかり見極めることが重要です。</p>
                <p><strong>もう一度プレイして、より良い未来を目指しましょう！</strong></p>
            </div>
        `;
    } else if (votedCount === 0) {
        // 無関心エンド - Never voted
        endingType = '無関心エンド';
        endingClass = 'bad';
        finalMessage = `
            <div class="outcome-message bad">
                <h3><i class="fas fa-user-slash"></i> ${endingType}</h3>
                <p><strong>あなたは一度も投票しませんでした...</strong></p>
                <p>無関心は、悪意ある勢力に力を与えてしまいます。</p>
                <p>投票しなかったことで、社会は望ましくない方向に進んでしまいました。</p>
                <p class="warning">⚠️ 「どうせ変わらない」という無関心が、最も危険な選択です。</p>
                <p><strong>次は勇気を出して投票してみましょう！</strong></p>
            </div>
        `;
    } else if (votedCount < Math.ceil(totalRounds * CONSISTENCY_THRESHOLD)) {
        // 中途半端エンド - Voted less than threshold of rounds
        endingType = '中途半端エンド';
        endingClass = 'neutral';
        finalMessage = `
            <div class="outcome-message neutral">
                <h3><i class="fas fa-face-meh"></i> ${endingType}</h3>
                <p>あなたは${votedCount}/${totalRounds}回しか投票しませんでした。</p>
                <p>参加することは素晴らしいですが、継続的な関心が社会を変える力になります。</p>
                <p>もっと積極的に政治に関わることで、より良い社会を作ることができます。</p>
                <p><strong>次回はもっと多くの選挙で投票してみましょう！</strong></p>
            </div>
        `;
    } else {
        // 全てのラウンドで投票した場合 - イデオロギーに基づくエンディング
        const validIdeologies = Object.keys(ideologyCounts)
            .filter(k => k !== 'bad' && k !== 'abstain' && ideologyCounts[k] > 0);
        
        // Safety check: ensure we have at least one valid ideology
        if (validIdeologies.length === 0) {
            // Fallback to diversity ending if no valid ideologies (shouldn't happen in normal play)
            endingType = '多様性尊重エンド';
            endingClass = 'good';
            finalMessage = `
                <div class="outcome-message good">
                    <h3><i class="fas fa-star"></i> ${endingType}</h3>
                    <p><strong>素晴らしい！あなたは全てのラウンドで投票しました！</strong></p>
                    <p>投票することで、社会に参加し、未来を作ることができます。</p>
                    <p><strong>実際の選挙でも、ぜひ投票に行ってください！</strong></p>
                </div>
            `;
        } else {
            const maxIdeology = validIdeologies.reduce((a, b) => 
                ideologyCounts[a] > ideologyCounts[b] ? a : b
            );
            
            const maxCount = ideologyCounts[maxIdeology];
            const hasConsistentChoice = maxCount >= Math.ceil(totalRounds * CONSISTENCY_THRESHOLD); // threshold or more of rounds
        
        if (hasConsistentChoice) {
            // 特定のイデオロギーに一貫して投票した場合の専用エンディング
            switch(maxIdeology) {
                case 'progressive':
                    endingType = '革新の未来エンド';
                    endingClass = 'good';
                    finalMessage = `
                        <div class="outcome-message good happy-end">
                            <h3><i class="fas fa-rocket"></i> ${endingType} <i class="fas fa-star"></i></h3>
                            <p><strong>素晴らしい！あなたは革新的な未来を選択しました！</strong></p>
                            <p>IT産業が発展し、若者の雇用が増加しています。再生可能エネルギーへの移行が進み、教育の無償化により誰もが学べる社会が実現しました。</p>
                            <p class="highlight">✨ テクノロジーと教育で、町は輝かしい未来へ！✨</p>
                            <p><strong>進歩的な政策が、持続可能な発展をもたらします。</strong></p>
                        </div>
                    `;
                    break;
                    
                case 'youth-focused':
                    endingType = '若者の力エンド';
                    endingClass = 'good';
                    finalMessage = `
                        <div class="outcome-message good happy-end">
                            <h3><i class="fas fa-users"></i> ${endingType} <i class="fas fa-star"></i></h3>
                            <p><strong>完璧です！若者の声が政治を変えました！</strong></p>
                            <p>学生ローンが免除され、起業支援により新しいビジネスが次々と生まれています。深夜交通網の拡充で、若者が活動しやすい環境が整いました。</p>
                            <p class="highlight">✨ 若者が主役の、活気ある社会が実現！✨</p>
                            <p><strong>あなたの世代が、未来を創造する力を持っています！</strong></p>
                        </div>
                    `;
                    break;
                    
                case 'environmental':
                    endingType = '環境保護エンド';
                    endingClass = 'good';
                    finalMessage = `
                        <div class="outcome-message good happy-end">
                            <h3><i class="fas fa-leaf"></i> ${endingType} <i class="fas fa-star"></i></h3>
                            <p><strong>素晴らしい！地球に優しい社会が実現しました！</strong></p>
                            <p>自然保護区が拡大され、プラスチックの使用が大幅に削減されました。有機農業が推進され、町はカーボンニュートラルを達成しました。</p>
                            <p class="highlight">✨ 緑豊かな、持続可能な未来へ！✨</p>
                            <p><strong>環境を守ることが、次世代への最高の贈り物です！</strong></p>
                        </div>
                    `;
                    break;
                    
                case 'centrist':
                    endingType = 'バランス重視エンド';
                    endingClass = 'good';
                    finalMessage = `
                        <div class="outcome-message good happy-end">
                            <h3><i class="fas fa-balance-scale"></i> ${endingType} <i class="fas fa-star"></i></h3>
                            <p><strong>完璧です！バランスの取れた社会が実現しました！</strong></p>
                            <p>段階的な改革により、予算配分が最適化されました。全世代型社会保障が整備され、持続可能な経済成長が達成されています。</p>
                            <p class="highlight">✨ 極端に偏らない、安定した発展の道へ！✨</p>
                            <p><strong>中道の知恵が、社会の調和を生み出しました！</strong></p>
                        </div>
                    `;
                    break;
                    
                case 'welfare-focused':
                    endingType = '福祉社会エンド';
                    endingClass = 'good';
                    finalMessage = `
                        <div class="outcome-message good happy-end">
                            <h3><i class="fas fa-heart"></i> ${endingType} <i class="fas fa-star"></i></h3>
                            <p><strong>素晴らしい！誰もが安心して暮らせる社会が実現しました！</strong></p>
                            <p>医療費が完全無料化され、高齢者福祉が充実しています。子育て支援金の増額により、安心して子育てができる環境が整い、障がい者支援も強化されました。</p>
                            <p class="highlight">✨ 温かい心が溢れる、支え合いの社会へ！✨</p>
                            <p><strong>福祉の充実が、すべての人に笑顔をもたらします！</strong></p>
                        </div>
                    `;
                    break;
                    
                case 'conservative':
                    endingType = '伝統重視エンド';
                    endingClass = 'good';
                    finalMessage = `
                        <div class="outcome-message good happy-end">
                            <h3><i class="fas fa-landmark"></i> ${endingType} <i class="fas fa-star"></i></h3>
                            <p><strong>完璧です！伝統と秩序が守られた社会が実現しました！</strong></p>
                            <p>伝統文化が保護され、財政が健全化されています。既存インフラが適切に維持され、治安が強化されることで、安全で秩序ある町になりました。</p>
                            <p class="highlight">✨ 歴史と伝統を大切にする、安定した社会へ！✨</p>
                            <p><strong>伝統の価値が、次世代に受け継がれています！</strong></p>
                        </div>
                    `;
                    break;
            }
            } else {
                // 多様な投票をした場合の汎用グッドエンディング
                endingType = '多様性尊重エンド';
                endingClass = 'good';
                finalMessage = `
                    <div class="outcome-message good">
                        <h3><i class="fas fa-star"></i> ${endingType}</h3>
                        <p><strong>素晴らしい！あなたは全てのラウンドで投票しました！</strong></p>
                        <p>様々な政党に投票することで、多角的な視点から政治を考えることができました。</p>
                        <p>一つのイデオロギーに固執せず、状況に応じて柔軟に判断する姿勢は大切です。</p>
                        <p><strong>投票を続けることで、社会はより良い方向に進みます！</strong></p>
                    </div>
                `;
            }
        }
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
