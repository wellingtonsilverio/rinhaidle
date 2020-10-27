const Discordjs = require("discord.js");

module.exports = (message) => {
	const embed = new Discordjs.MessageEmbed()
		.setTitle("Comandos")
		.setDescription(
			"Lista de comandos que podem ser executados pelo Rinha IDLE"
		)
		.setColor([203, 153, 126])
		.addField(
			"chocar [nome]",
			'Cria um novo galo, Exemplo: "!r criar Poderoso"'
		)
		.addField(
			"treinar [nome] forca",
			'Treina o galo para adquirir mais força, Exemplo: "!r treinar Poderoso forca"'
		)
		.addField(
			"treinar [nome] defesa",
			'Treina o galo para adquirir mais resistencia, Exemplo: "!r treinar Poderoso defesa"'
		)
		.addField(
			"status",
			'Exibe todos seus galos e quantidade de dinheiro, Exemplo: "!r status"'
		)
		.addField(
			"status [nome]",
			'Exibe todos dados do galo, Exemplo: "!r status Poderoso"'
		)
		.addField(
			"lutar [nome] [@oponente]",
			'Luta com outro Galo para ganhar moedas, Exemplo: "!r lutar Poderoso @Lucas"'
		);
	message.reply(embed);
};
