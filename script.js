let currentPageUrl = 'https://akabab.github.io/starwars-api/api/all.json' // guarda o endereço da API
let characters = []; // começa vazio, dps da API responder aparece, esse array passa a conter os personagens
let currentPage = 1; // guarda qual página estamos visualizando, começando em 1 e quando usamos a currentPagge++ se torna 2, 3, 4...

const charactersPerPage = 10; // define quantos personagens aparecem por página, se quiser também posso modificar para 20 personagens por página

const mainContent = document.getElementById('main-content');
// Daqui para cima são as informações que o programa precisa guardar.

// async - indica que essa função vai trabalhar com operações que podem levar algum tempo, como buscar dados pela internet
async function loadCharacters() { // loadCharacters() > mostra carregando > fetch(API) > verifica response.ok > transforma em JSON(converte o corpo da resposta para um objeto/array JavaScript que podemos utilizar no código)  > guarda em characters > displayCharacters()

    mainContent.innerHTML = '<p>Carregando personagens...</p>' // Carregamento

    try { 
        const response = await fetch(currentPageUrl); // Busca de dados

        if (!response.ok) { // se a respota não estiver ok, o que devemos fazer. ! significa negação
            throw new Error('Não foi possível carregar os personagens'); // throw significa que estamos lançando ume erro manualmente
        }                                                               // try > tenta executar > if (!response.ok) { > se tiver problema > Throw new Error('mensagem de erro desejada.') > catch
                                                                        // fetch() > recebe resposta > response.ok > esta ok? > se sim , continua , cards > se não, throw > catch > mensagem de erro.
       
        characters = await response.json();
        
        console.log(characters);
       
        displayCharacters();  // exibição da resposta
    
    } catch (error) { //se algo de errado tem esse cara

        console.error('Erro ao carregar os personagens', error);

        mainContent.innerHTML = ` 
            <p>Não foi poosível carregar os personagens.</p>
            <p>Verifique sua conexão com a internet e tente novamente.</p>
            <button id="retry-button">Tentar novamente</button>
        `;

        const retryButton = document.getElementById('retry-button'); // encontra o button

        retryButton.addEventListener('click', () => {  // adiciona o evento
            loadCharacters();
    });

    }
}

function translateEyeColor(color) { // API > character.eyeColor > translateEyeColor > Azul
    const colors = {
        blue: 'Azul',
        brown: 'Marrom',
        yellow: 'Amarelo',
        orange: 'Laranja',
        black: 'Preto',
        red: 'Vermelho',
        pink: 'Rosa',
        gold: 'Dourado',
        hazel: 'Avelã',
        unknown:'Desconhecido',
        };
    return colors[color] || color;
}

function formatBirthYear(year) { // API > character.born > formatBirthyear() > 19 BBY
    if (year === undefined || year === null) {
        return 'Desconhecido';
    }

    if (year < 0) {
        return `${Math.abs(year)} BBY`;
    }

    return `${year} ABY`;
}

function displayCharacters() { // pega os dados em characters, e decide quais personagens devem aparecer naquela página.
    mainContent.innerHTML = ''; // limpa os cards anteriores 

    const startIndex = (currentPage - 1) * charactersPerPage; // calcula o índice inicial dos personagens que serão exibidos na página atual
    const endIndex = startIndex + charactersPerPage; // calcula o índice final da seleção

    const charactersToShow = characters.slice(startIndex, endIndex); //cria uma seleção do array contendo apenas os personagens da página atual

    charactersToShow.forEach(character => { // para cada personagem que precisamos mostrar, faça o seguinte/ O forEach percorre cada personagem que deve ser exibido e executa o código para criar o card correspondente.
        const card = document.createElement('div'); // cria um elemento <div> dinamicamente usando JavaScript
        card.classList.add('cards'); // adiciona a classe CSS "cards" ao elemento criado

        card.style.backgroundImage = `url(https://raw.githubusercontent.com/vieraboschkova/swapi-gallery/master/static/assets/img/people/${character.id}.jpg)`; // aqui as imagens

        const nameBg = document.createElement('div'); // criação do nome
        nameBg.classList.add('character-name-bg');

        const name = document.createElement('span'); // criação do nome
        name.classList.add('character-name'); 

        name.textContent = character.name;

        nameBg.appendChild(name); // name > nameBg > card > mainContent > página
        card.appendChild(nameBg);
        
        card.addEventListener('click', () => { // adicione um evento que fique observando determinada ação > o 'click' > observe quando ouver o click > o card observa, entao.. Quando o usuário clicar neste card, execute o código dentro das chaves
                                                // esse card que acabei de criar também deve reagir quando alguém clicar nele
                                                // () => {codigo}    =  uma função que será executada quando o evento acontecer, clicar no card > executar está função > abrir e preencher o modal
            const modal = document.getElementById('modal'); // esses que serão os elementos encontrados e modificados. colocando assim as informações necessárias para este elemento ( primeiro )
            const modalContent = document.getElementById('modal-content'); // esses que serão os elementos encontrados e modificados (segundo) pois modal esta dentro de modalcontent que não tem nada, ate que haja o click

            modalContent.innerHTML = ` 
                <span class="close-button" id="close-button">&times;</span>
                <div class="character-image" style="background-image: url('https://raw.githubusercontent.com/vieraboschkova/swapi-gallery/master/static/assets/img/people/${character.id}.jpg')"></div>
                <h2>${character.name}</h2> 
                <p><strong>Altura:</strong> ${character.height} m</p>
                <p><strong>Peso:</strong> ${character.mass} kg</p>
                <p><strong>Cor dos Olhos:</strong> ${translateEyeColor(character.eyeColor)}</p>
                <p><strong>Nascimento:</strong> ${formatBirthYear(character.born)}</p>
            `;

            modal.style.visibility = 'visible'; // responsavel por mostrar o modal na tela
                                        
            // o modal é reutilizado para todos os personagens. quando o usuário clica em um card, o Javascript pega os dados daquele personagem e monta dinamicamente o conteúdo do modal0

            const closeButton = document.getElementById('close-button');
            closeButton.addEventListener('click', () => {
                modal.style.visibility = 'hidden';
            });
        });

        mainContent.appendChild(card);  // e aqui tudo é colocado dentro da página.
    });

    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');
    
    backButton.style.visibility = currentPage === 1 ? 'hidden' : 'visible'; // então usar ? que é o operador ternário
                                                                            // é basicamente uma forma curta de escrtever
                                                                            // o IF e ELSE

    nextButton.style.visibility = endIndex >= characters.length ? 'hidden' : 'visible'; // sempre que tiver:  condição ? valor1 : valor2;
                                                                                        // é o mesmo que:  Se isso for verdadeiro > faça isso1. se for falso > faça aquilo2
                                                                                        // variável + comparação + alteração do HTML/CSS pelo JavaScript
}

const modal = document.getElementById('modal');

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.visibility = 'hidden';
    }
});

window.onload = function(){

    loadCharacters();

const nextButton = document.getElementById('next-button');
const backButton = document.getElementById('back-button');

nextButton.addEventListener('click', () => {

    const totalPages = Math.ceil(characters.length / charactersPerPage);

    if(currentPage < totalPages) {
    currentPage++;
    displayCharacters(); 
}

});

backButton.addEventListener('click', () => {

    if (currentPage > 1)  {
    currentPage--;
    displayCharacters();
}
});

}
