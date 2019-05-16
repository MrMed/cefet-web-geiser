var express = require('express'),
    app = express(),
    fileSystem = require('fs'),
    _ = require('underscore')

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
var db = {
    playersData: JSON.parse(fileSystem.readFileSync(__dirname + "/data/jogadores.json")),
	matchesPerPlayerData: JSON.parse(fileSystem.readFileSync(__dirname + "/data/jogosPorJogador.json"))
}


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???');
app.set('view engine', 'hbs');

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json
app.set('views', 'server/views');
app.get('/', function (req, res) {res.render('index', db.playersData)});

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código
app.get('/jogador/:id/', function (req, res) {
    var matchesPerPlayer = db.matchesPerPlayerData[req.params.id],
	    matchesNotPlayed = _.where(matchesPerPlayer.games, {playtime_forever: 0}),
	    player = _.find(db.playersData.players, function(e) {
        return e.steamid === req.params.id
    })
	
    
    matchesPerPlayer.jogosNaoJogados = matchesNotPlayed.length
	matchesPerPlayer.games = _.sortBy(matchesPerPlayer.games, function(data) {
        return -data.playtime_forever
    })
	matchesPerPlayer.games = _.first(matchesPerPlayer.games, 5)
	matchesPerPlayer.games = _.map(matchesPerPlayer.games, function(data) {
		var time = Math.round(data.playtime_forever/60)
		data.playtime_forever_horas = time
		return data
    })
	res.render('jogador', {profile:player, gameInfo:matchesPerPlayer, favorito:matchesPerPlayer[0]})
})

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static('client/'))

// abrir servidor na porta 3000
// dica: 1-3 linhas de código
app.listen(3000, function () {console.log('Listen: http://localhost:3000')})