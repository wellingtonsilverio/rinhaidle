const Discordjs = require("discord.js");

module.exports = (message) => {
	const embed = new Discordjs.MessageEmbed()
		.setTitle("Comandos")
		.setDescription(
			"Lista de comandos que podem ser executados pelo Rinha IDLE"
		)
		.setColor([203, 153, 126])
		.addField(
			"chocar [nome do galo]",
			'Cria um novo galo, Exemplo: "!r chocar Poderoso"'
		)
		.addField(
			"treinar [nome do galo] forca",
			'Treina o galo para adquirir mais força, Exemplo: "!r treinar Poderoso forca"'
		)
		.addField(
			"treinar [nome do galo] defesa",
			'Treina o galo para adquirir mais resistencia, Exemplo: "!r treinar Poderoso defesa"'
		)
		.addField(
			"status",
			'Exibe todos seus galos e quantidade de moedas, Exemplo: "!r status"'
		)
		.addField(
			"status [nome do galo]",
			'Exibe todos dados do galo, Exemplo: "!r status Poderoso"'
		)
		.addField(
			"lutar [nome do galo] [@oponente]",
			'Luta com outro Galo para ganhar moedas, Exemplo: "!r lutar Poderoso @Lucas"'
		)
		.addField(
			"comprar",
			'Lista os produtos disponiveis para comprar, Exemplo: "!r comprar"'
		)
		.addField(
			"comprar [nome do galo] [nome do produto]",
			'Compra o produto, Exemplo: "!r comprar Poderoso bico-madeira"'
		);
	message.reply(embed);
};
